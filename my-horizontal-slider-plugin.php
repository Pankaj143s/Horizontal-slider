<?php
/**
 * Plugin Name: My Horizontal Slider
 * Description: A custom horizontal slider with smooth, linear mouse-wheel scroll hijacking.
 * Version: 1.0
 * Author: Your Name
 */

if (!defined('ABSPATH')) { exit; }

// Enqueue plugin styles and scripts
function my_horizontal_slider_enqueue_scripts() {
    wp_register_style(
        'my-horizontal-slider-style',
        plugin_dir_url(__FILE__) . 'style.css',
        array(),
        '1.0'
    );
    wp_enqueue_style('my-horizontal-slider-style');

    wp_register_script(
        'my-horizontal-slider-script',
        plugin_dir_url(__FILE__) . 'script.js',
        array(),
        '1.0',
        true
    );
    wp_enqueue_script('my-horizontal-slider-script');
}
add_action('wp_enqueue_scripts', 'my_horizontal_slider_enqueue_scripts');

// Shortcode to output the slider
function my_horizontal_slider_shortcode() {
    ob_start(); // Buffer output
    ?>
    <section class="slider-section" id="sliderSection">
      <div class="slider-track" id="sliderTrack">
        <!-- Slide 1 -->
        <div class="slide">
          <img src="<?php echo plugin_dir_url(__FILE__) . 'assets/Pi1.png'; ?>" alt="Organic Protection" />
          <p>Purely Organic Protection – No Chemicals</p>
        </div>
        <!-- Slide 2 -->
        <div class="slide">
          <img src="<?php echo plugin_dir_url(__FILE__) . 'assets/Pi2.png'; ?>" alt="Tested & Proven" />
          <p>Tested & Proven – 7 Years of Research</p>
        </div>
        <!-- Slide 3 -->
        <div class="slide">
          <img src="<?php echo plugin_dir_url(__FILE__) . 'assets/P1.png'; ?>" alt="No Side Effects" />
          <p>Keeps Ticks Away Without Side Effects</p>
        </div>
        <!-- etc. Add your slides -->
      </div>
    </section>
    <?php
    return ob_get_clean(); // Return captured markup
}
add_shortcode('my_horizontal_slider', 'my_horizontal_slider_shortcode');
