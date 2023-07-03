<template>
    <div id="watchContainer" class="watchContainer _watchContainer" ref="watch">
        <NavTop/>
    </div>
</template>

<script>

import NavTop from '../baseComponents/NavTop'

export default {
    name: 'watch',
    components: {
        NavTop
    },
    data() {
        return {
        };
    },
    methods: {
        
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
#watchContainer {
    margin: 0;
	padding: 0;
	overscroll-behavior: none;
	overflow: hidden;
}
// 大于800px
@media only screen and (min-width: 800px){
    .watchContainer{
    }
}

// 小于800px
@media only screen and (max-width: 800px){
    ._watchContainer{
    }
}
</style>
