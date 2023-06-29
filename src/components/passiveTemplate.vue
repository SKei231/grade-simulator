<template>

</template>

<script setup lang="ts">

const open = () => {
    console.log("open");
}
const close = () => {
    console.log("close");
}

defineExpose({
    open,close
})
</script>

<style scoped>

/* モバイル　1000px
--------------------------------------------------------------------------------- */
@media screen and (max-width: 1030px) {
}
</style>