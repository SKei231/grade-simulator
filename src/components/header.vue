<template>
    <div id="Header">
        <h1>Fes-Simulator</h1>
        <div id="usehelp" @click="noteUrl()"><p>使い方(note)</p></div>
    </div>
</template>

<script setup lang="ts">
const noteUrl = () => {
    const note = 'https://note.com/tunakan_yt212/n/na0cd640b09b5'; // ver.1.1.1
    open(note);
}

</script>

<style scoped>
#Header {
    display: flex;
}
#Header h1 {
    padding-left: 5%;
    font-size: 35px;
}
#usehelp {
    display: flex;
    margin-left: 5%;
    text-align: center;
    justify-content: center;
    cursor: pointer;
}
#usehelp:hover p {
    text-decoration: underline;
}
#usehelp p {
    display: flex;
    height: 20px;
    font-size: 16px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin: 25px 0;
}

/* モバイル　1000px
--------------------------------------------------------------------------------- */
@media screen and (max-width: 1030px) {
    #Header h1 {
        font-size: 1.5rem;
    }
    #usehelp {
        display: none;
    }
}
</style>
