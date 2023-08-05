<template>
    <div class="container" :style="containerStyle" style="z-index: 99998">
        <ProjectTitle :options="titleOptions"></ProjectTitle>

        <div class="control_panel" v-for="data in dataList" :key="data.cn">
            <label class="control_panel-label">
                <input type="checkbox" v-model="data.checked" @click="handleCheckboxChange" />
                <span class="name">{{ data.cn }}</span>
            </label>
        </div>
    </div>
</template>
  
<script>
import ProjectTitle from "../Project_title";
import { mapMutations } from 'vuex';

export default {
    name: "ControlPanel",
    data() {
        return {
            titleOptions: {
                // order: "04",
                cn: "控制面板",
            },
            dataList: [
                {
                    cn: "环境监测",
                    checked: true,
                },
                {
                    cn: "变桨系统",
                    checked: true,
                },
                {
                    cn: "数据监测",
                    checked: true,
                },
                {
                    cn: "发电参数",
                    checked: true,
                },
                {
                    cn: "统计参数",
                    checked: true,
                }
            ],
        };
    },
    components: {
        ProjectTitle,
    },
    computed: {
        containerStyle() {
            return {
                right: this.dataList[3].checked ? '30vh' : '2vh',
            };
        },
    },
    methods: {
        ...mapMutations('global', ['setTurbineTableList']),
        handleCheckboxChange() {
            this.setTurbineTableList(this.dataList);
        },
    },
};
</script>
  
<style lang="scss" scoped>
$width: 13vw;
$height: 4.16vh;

.container {
    position: absolute;
    top: 6vh;
    right: 30vh;
}

.control_panel {
    width: $width;
    height: $height;
    background-color: #0d4560;
    display: flex;
    justify-content: space-between;
    line-height: $height;
    font-size: 1.0rem;
    padding: 0 1.2rem;
    box-sizing: border-box;
    color: #fff;
    margin-bottom: 1rem;
    background-image: url("../../../../assets/images/panel.png");
    background-size: $width $height;

    .number_value {
        margin: 0 5px;
        color: #1ac2e3;
    }

    .unit {
        color: #7da2dc;
    }

    input[type="checkbox"] {
        margin-right: 5px;
        cursor: pointer;
    }

    /* 根据选中状态设置样式 */
    input[type="checkbox"]:checked+.name {
        color: #1ac2e3;
    }

    input[type="checkbox"]:checked+.name+div .number_value {
        color: #1ac2e3;
    }

    input[type="checkbox"]:checked+.name+div .unit {
        color: #7da2dc;
    }
}
</style>