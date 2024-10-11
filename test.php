<?php 
class PressMart_Update_Theme {
	public $prefix;
	public $theme_data;
	public $current_version;
	public $slug;
	public $theme_update_data;
	public $option_name = 'envato_purchase_code_39241221';
	function __construct( $purchase_code = null ) {
		$this->prefix			= PRESSMART_PREFIX;
		$this->theme_data		= $this->get_theme_data();
		$this->current_version	= $this->theme_data->get('Version');
        $this->api_url			= 'https://www.presslayouts.com/api/envato';
        $this->token_key		= $this->get_token_key();
        if($purchase_code)		{
			$this->purchase_code = $purchase_code;
		}else {
			$this->purchase_code = $this->get_purchase_code();
		}
        $this->item_name	= 'PressMart - Modern Elementor WooCommerce WordPress Theme';
        $this->slug			= 'pressmart';
		$this->item_id		= '39241221';
		
		$this->changelog_link = 'https://pressmart.presslayouts.com/';
     
		/* Theme Update */
		add_action( 'wp_ajax_activate_theme', array( $this, 'activate_theme' ) );
		
		/* Theme Deactivate */
		add_action( 'wp_ajax_deactivate_theme', array( $this, 'deactivate_theme_data' ) );
		
		/* Admin Notice */
		add_action( 'admin_notices', array( $this, 'check_theme_license_activate' ), 90);
		
	}
	
	public function activate_theme(){
		check_ajax_referer( 'pressmart_nonce', 'nonce' );
		$purchase_code			= sanitize_key( wp_unslash( $_REQUEST['purchase_code'] ) );
		$theme_data				= $this->get_activate_theme_data($purchase_code);
		$data					= json_decode($theme_data,true);
		$data['purchase_code']	= $purchase_code;
		$response				= array( 'message'=> $data['message'], 'success'=> 0 );
		if($data['success']){			
			$this->update_theme_data($data);
			$response = array( 'message'=> $data['message'], 'success'=> 1 );
		}		
		echo json_encode($response);
		die();
	}
	
	public function update_theme_data($data){
		update_option( 'pressmart_token_key',$data['token'] );
		update_option( 'pressmart_is_activated', true );
		update_option( 'pressmart_plugin_file', $data['file'] );
		update_option( $this->option_name,$data['purchase_code'] );
	}
	
	public function deactivate_theme_data(){
		check_ajax_referer( 'pressmart_nonce', 'nonce' );
		$purchase_code			= sanitize_key( wp_unslash( $_REQUEST['purchase_code'] ) );
		$theme_data				= $this->deactivate_theme($purchase_code);
		$data					= json_decode($theme_data,true);
		$data['purchase_code']	= $purchase_code;
		$response				= array( 'message'=> $data['message'], 'success'=> 0 );
		if($data['success']){			
			$this->remove_theme_data();
			$response = array( 'message'=> $data['message'], 'success'=> 1 );
		}		
		echo json_encode($response);
		die();
	}
	
	public function remove_theme_data(){
		delete_option( 'pressmart_token_key' );
		delete_option( 'pressmart_is_activated');
		delete_option( 'pressmart_plugin_file');
		delete_option( $this->option_name );
	}
	
	public function get_activate_theme_data($purchase_code){
		global $wp_version;		
		$item_id	= $this->item_id;		
		$domain		= $this->get_domain();
		$response	= wp_remote_request($this->api_url.'/activate.php', array(
				'user-agent'	=> 'WordPress/'.$wp_version.'; '. home_url( '/' ) ,
				'method'		=> 'POST',
				'sslverify' => false,
				'body'			=> array(
					'purchase_code'	=> urlencode($purchase_code),
					'item_id'		=> urlencode($item_id),
					'domain'		=> urlencode($domain),
				)
			)
		);

        $response_code = wp_remote_retrieve_response_code( $response );
        $activate_info = wp_remote_retrieve_body( $response );

        if ( $response_code != 200 || is_wp_error( $activate_info ) ) {
			return json_encode(array("message"=>"Registration Connection error",'success'=>0));
        }
		return $activate_info;
	}
	
	public function deactivate_theme($purchase_code){
		global $wp_version;		
		$token_key	= $this->get_token_key();
		$item_id 	= $this->item_id;
		$response	= wp_remote_request($this->api_url.'/deactivate.php', array(
				'user-agent'	=> 'WordPress/'.$wp_version.'; '. home_url( '/' ) ,
				'method'		=> 'POST',
				'sslverify' => false,
				'body'			=> array(
					'purchase_code'	=> urlencode($purchase_code),
					'token_key'		=> urlencode($token_key),
					'item_id' 		=> urlencode($item_id),
				)
			)
		);

        $response_code = wp_remote_retrieve_response_code( $response );
        $activate_info = wp_remote_retrieve_body( $response );

        if ( $response_code != 200 || is_wp_error( $activate_info ) ) {
            return json_encode(array("message"=>"Registration Connection error",'success'=>0));
        }
		if(  $response_code == 200 ){
			return json_encode( array( "message"=>"Successfully deactivate theme license.",'success'=> 1 ) ) ;
		}
		return $activate_info;
	}
	
	public function get_domain() {
        $domain = get_option('siteurl');
        $domain = str_replace('http://', '', $domain);
        $domain = str_replace('https://', '', $domain);
        $domain = str_replace('www.', '', $domain);
        return $domain;
    }
	public function get_theme_data(){
		return wp_get_theme();
	}
	
	public function get_current_version(){
		return $this->current_version;
	}
	
	public function get_token_key(){
		return get_option( 'pressmart_token_key');
	}
	
	public function get_purchase_code(){
		return get_option( $this->option_name);
	}
		
	public function pressmart_is_license_activated(){ 
		if(get_option('pressmart_is_activated') && get_option($this->option_name)){
			return true;
		}
		return false;
	}

	public function check_theme_license_activate(){
            
		if( pressmart_is_license_activated() ){
			return;
		}
		$theme_details		= wp_get_theme();
		$activate_page_link	= admin_url( 'admin.php?page=pressmart-theme' );

		?>
		<div class="notice notice-error is-dismissible">
			<p>
				<?php 
					echo sprintf( esc_html__( ' %1$s Theme is not activated! Please activate your theme and enjoy all features of the %2$s theme', 'pressmart'), 'PressMart','Pressmart' );
					?>
			</p>
			<p>
				<strong style="color:red"><?php esc_html_e( 'Please activate the theme!', 'pressmart' ); ?></strong> -
				<a href="<?php echo esc_url(( $activate_page_link )); ?>">
					<?php esc_html_e( 'Activate Now','pressmart' ); ?> 
				</a> 
			</p>
		</div>
	<?php
	}
}
global $obj_updatetheme;
$obj_updatetheme = new PressMart_Update_Theme();