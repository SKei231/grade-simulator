<template>
    <div id="Header">
        <h1>Fes-Simulator</h1>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
#Header {
    display: flex;
}
#Header h1 {
    padding-left: 5%;
    font-size: 35px;
}

/* モバイル　1000px
--------------------------------------------------------------------------------- */
@media screen and (max-width: 1030px) {
    #Header h1 {
        font-size: 1.5rem;
    }
}
</style>
