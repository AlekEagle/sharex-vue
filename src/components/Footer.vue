<template>
  <div ref="footerBox" class="footer_box">
    <slot />
    <div class="cpyrit">
      <a href="https://alekeagle.com" class="footer_text"
        >© 2019-2021 AlekEagle</a
      >
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Footer'
  };
</script>

<style>
  .footer_text {
    color: #a8a8a8;
    font-size: 20px;
    margin-bottom: 0px;
    margin-top: 20px;
    margin-left: 5px;
    margin-right: 5px;
    text-decoration: none;
    transition-property: color;
    transition-duration: 0.3s;
  }

  .footer_text:hover {
    transition-property: color;
    transition-duration: 0.3s;
    color: #1199ff;
  }

  .footer_box {
    width: 100%;
    position: relative;
    float: left;
    z-index: 1;
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
