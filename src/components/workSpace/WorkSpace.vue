<template>
    <div>
        <NavTop></NavTop>
        <div style="width: 100%;display: flex;flex-direction: column;align-items: center;margin-bottom: 40px;">
            <PanelGroup></PanelGroup>
            <TransactionTable></TransactionTable>
            <PreTransactionTable></PreTransactionTable>
        </div>
    </div>
</template>
<script>
import NavTop from '../baseComponents/NavTop'
import PanelGroup from './subcomponents/PanelGroup'
import TransactionTable from './subcomponents/TransactionTable'
import PreTransactionTable from './subcomponents/PreTransactionTable'

export default {
    name: 'workSpace',
    components: {
        NavTop,PanelGroup,TransactionTable,PreTransactionTable
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
