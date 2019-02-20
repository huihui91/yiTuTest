<template>
  <section class="msgBox" >
    <div class="msg">
      {{msg}}
    </div>
  </section>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .msgBox{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%)
  }
  .msg{
    background: rgba(0,0,0,0.6);
    color:#fff;
    padding: 10px 20px;
    border-radius: 5px;
  }
</style>
