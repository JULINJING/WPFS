<template>
    <div>
        <NavTop></NavTop>
        <div style="width: 100%;display: flex;flex-direction: column;align-items: center;">
            <PanelGroup></PanelGroup>
            <TransactionTable></TransactionTable>
        </div>
    </div>
</template>
<script>
import NavTop from '../baseComponents/NavTop'
import PanelGroup from './subcomponents/PanelGroup'
import TransactionTable from './subcomponents/TransactionTable'

export default {
    name: 'workSpace',
    components: {
        NavTop,PanelGroup,TransactionTable
    },
    data() {
        return {
        }
    },
    created(){
    },
    computed:{
    },
    methods:{
    },
}
</script>
<style scoped>

</style>
