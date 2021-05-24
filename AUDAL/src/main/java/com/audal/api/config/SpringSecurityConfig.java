package com.audal.api.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;


@Configuration
@Order(SecurityProperties.BASIC_AUTH_ORDER)
public class SpringSecurityConfig extends WebSecurityConfigurerAdapter{
	
	
   /* @Autowired  
    protected void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {  
        auth.inMemoryAuthentication()  
            .withUser("alpha")  
            .password("s3cr3t") // Spring Security 5 requires specifying the password storage format  
            .roles("USER");  
        auth.inMemoryAuthentication()  
        .withUser("admin")  
        .password("s3cr3t") // Spring Security 5 requires specifying the password storage format  
        .roles("USER", "ADMIN");  
    } 
    */
	
    @Bean
    public UserDetailsService userDetailsService() {
        PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
        UserDetails user = User.withUsername("alpha").password(encoder.encode("s3cr3t"))
        .roles("USER").build();
        UserDetails user2 = User.withUsername("bravo").password(encoder.encode("12345"))
                .roles("ADMIN").build();
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(user);
        manager.createUser(user2);
        return manager;
    }
    
    
    @Override  
    public void configure(HttpSecurity http) throws Exception {  
        
    	http.httpBasic().realmName("AUDAL Access Control")
    	//.and().authorizeRequests().antMatchers("/login/login.html", "/webjars/**", "/", "/semantic/*",  "/user", "/js/**", "/css/**", "/template/home.html")
    	.and().authorizeRequests().antMatchers("/login/login.html", "/webjars/**", "/",   "/user", "/js/**", "/css/**", "/template/home.html") 
    	.permitAll().anyRequest().authenticated()
    	.and().csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
    	//.and().csrf().and().cors().disable();
    }  
    
}
