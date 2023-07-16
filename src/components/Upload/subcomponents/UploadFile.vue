<template>
    <div class="totalinfocontainer _totalinfocontainer">
        <!-- Form -->
        <el-upload drag multiple :action="'http://' + serverIp + ':7070/file/upload'" :on-success="handleUploadSuccess"
            :on-error="handleUploadError" :before-upload="beforeUpload" :limit="10" :on-exceed="handleExceed"
            :file-list="fileList" :on-preview="handlePreview" accept=".csv">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text PC_upload">
                将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__text M_upload"><em>点击上传</em></div>
        </el-upload>

        <el-dialog title="设置预处理预测参数" :visible.sync="dialogFormVisible" top="25vh" width="35%" class="dialog-box"
            :show-close="false">
            <div class="form-row">
                <el-tag class="tag">选择异常检测方法</el-tag>
                <el-radio-group v-model="outlierRadio">
                    <el-radio-button label="孤立森林" class="bordered-checkbox" border></el-radio-button>
                    <el-radio-button label="KNN" class="bordered-checkbox" border></el-radio-button>
                    <el-radio-button label="DBSCAN" class="bordered-checkbox" border></el-radio-button>
                    <el-radio-button label="PCA" class="bordered-checkbox" border></el-radio-button>
                </el-radio-group>
            </div>

            <div class="form-row">
                <el-tag class="tag">缺失值处理方法</el-tag>
                <el-radio-group v-model="missingRadio">
                    <el-radio-button label="简单填充" class="bordered-checkbox" border></el-radio-button>
                    <el-radio-button label="线性插值" class="bordered-checkbox" border></el-radio-button>
                    <el-radio-button label="Lightgbm" class="bordered-checkbox" border></el-radio-button>
                    <el-radio-button label="XgBoost" class="bordered-checkbox" border></el-radio-button>
                </el-radio-group>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button class="confirmButton" @click="handleDialogConfirm" :round="true">确 定
                </el-button>
            </div>
        </el-dialog>

        <el-dialog title="设置预处理预测参数" :visible.sync="dialogFormVisible" top="25vh" width="35%" class="dialog-box"
            :show-close="false">
            <div class="form-row">
                <el-tag class="tag">选择异常检测方法</el-tag>
                <el-radio-group v-model="outlierRadio">
                    <el-radio-button label="孤立森林" class="bordered-checkbox" border></el-radio-button>
                    <el-radio-button label="KNN" class="bordered-checkbox" border></el-radio-button>
                    <el-radio-button label="DBSCAN" class="bordered-checkbox" border></el-radio-button>
                    <el-radio-button label="PCA" class="bordered-checkbox" border></el-radio-button>
                </el-radio-group>
            </div>

            <div class="form-row">
                <el-tag class="tag">缺失值处理方法</el-tag>
                <el-radio-group v-model="missingRadio">
                    <el-radio-button label="简单填充" class="bordered-checkbox" border></el-radio-button>
                    <el-radio-button label="线性插值" class="bordered-checkbox" border></el-radio-button>
                    <el-radio-button label="Lightgbm" class="bordered-checkbox" border></el-radio-button>
                    <el-radio-button label="XgBoost" class="bordered-checkbox" border></el-radio-button>
                </el-radio-group>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button class="confirmButton" @click="handleDialogConfirm" :round="true">确 定</el-button>
            </div>
        </el-dialog>

        <div class="table-box" v-if="showTable">
            <h1 style="margin-top: 20px;margin-bottom: 10px;">预处理后数据</h1>
            <el-table ref="mytable" :data="curData" highlight-current-row stripe
                style="width: 98%;margin-bottom: 20px" size="mini" max-height="300" border :cell-style="rowStyle">
                <el-table-column fixed prop="DATATIME" label="DATATIME" width="150" align="center">
                </el-table-column>
                <el-table-column prop="WINDSPEED" label="WINDSPEED" width="150" align="center">
                </el-table-column>
                <el-table-column prop="PREPOWER" label="PREPOWER" width="150" align="center">
                </el-table-column>
                <el-table-column prop="WINDDIRECTION" label="WINDDIRECTION" width="150" align="center">
                </el-table-column>
                <el-table-column prop="TEMPERATURE" label="TEMPERATURE" width="150" align="center">
                </el-table-column>
                <el-table-column prop="HUMIDITY" label="HUMIDITY" width="150" align="center">
                </el-table-column>
                <el-table-column prop="PRESSURE" label="PRESSURE" width="150" align="center">
                </el-table-column>
                <el-table-column prop="AWS" label="ROUND(A.WS,1)" width="150" align="center">
                </el-table-column>
                <el-table-column prop="APOWER" label="ROUND(A.POWER,0)" width="150" align="center">
                </el-table-column>
                <el-table-column prop="YD15" label="YD15" width="150" align="center">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { serverIp } from "../../../../public/config.js";
import { mapMutations } from "vuex";
import rawData from '../../../assets/testJson/11.json'

export default {
    props: {
        tableData: Array,
    },
    data() {
        return {
            serverIp: serverIp,
            dialogFormVisible: false,
            showTable: true,
            fileList: [],
            outlierRadio: "",
            missingRadio: "",
            jsonData: [],
            curData: [],
            curfile: new Object(),
            total: 0,
            currentPage: 1,
            pageSize: 50,
        };
    },
    mounted(){
        this.curData = JSON.parse(JSON.stringify(rawData));
    },
    methods: {
        ...mapMutations("global", ["setUploadedFileName"]),

        initVirtualScroll() {
            /*指定table的ref*/
            var table = this.$refs.mytable.bodyWrapper;

            /*浏览器兼容*/
            let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            let ff = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器

            if (ff) {
                table.addEventListener('DOMMouseScroll', (event) => {
                    let detail = event.detail;
                    // 滚动方向
                    let down = detail > 0;
                    // 根据滚动方向和距离修改滚动位置
                    if (down) {
                        this.currentPage++;
                    } else {
                        this.currentPage--;
                    }
                    this.updateTableData();
                });
            } else {
                table.addEventListener('mousewheel', (event) => {
                    let wheel = event.deltaY;
                    //滚动方向
                    let down = wheel > 0;
                    // 根据滚动方向和距离修改滚动位置
                    if (down) {
                        this.currentPage++;
                    } else {
                        this.currentPage--;
                    }
                    this.updateTableData();

                });
            }
        },
        updateTableData() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = this.currentPage * this.pageSize;
            this.curData = this.jsonData.slice(start, end);
        },
        rowStyle() {
            return "text-align:center";
        },

        // 上传文件成功
        handleUploadSuccess(response, file, fileList) {
            this.$message({
                message: "上传成功",
                type: "success",
                offset: 50,
            });

            // 上传成功后，1.5秒后显示对话
            setTimeout(() => {
                this.dialogFormVisible = true;
            }, 1000);

            this.curfile = file;

            this.setUploadedFileName(file.name);
        },

        // 上传文件之前的钩子
        beforeUpload(file) {
            const isCSV = file.type === "text/csv";

            if (!isCSV) {
                this.$message({
                    message: "上传的数据只能是 csv 格式!",
                    type: "error",
                    offset: 50,
                });
            }

            return isCSV;
        },

        async fetchData() {
            const fileResponse = JSON.stringify(this.curfile.response);
            const fileName = fileResponse.substring(fileResponse.lastIndexOf("/") + 1);
            const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
            // TODO
            await this.request.get("/file/processed/json/" + fileNameWithoutExtension + ".json").then(res => {
                // if(res.code === "200"){
                console.log(res);
                this.jsonData = JSON.parse(res.jsonContent);
                this.curData = this.jsonData.slice(0, 50);
                // }
            })
            this.$emit('update-table-data', this.jsonData.slice(0, 7 * 96));
        },

        // 上传文件失败
        handleUploadError(err, file, fileList) {
            this.$message({
                message: "上传失败",
                type: "error",
                offset: "50", //距离顶部的位置
            });
            console.log(err);
        },

        handleExceed(files, fileList) {
            this.$message({
                message: `当前限制选择 10 个文件，本次选择了 ${files.length
                    } 个文件，共选择了 ${files.length + fileList.length} 个文件`,
                type: "warning",
                offset: "50", //距离顶部的位置
            });
        },
        handlePreview(file) {
            this.curfile = file;
            this.curData = [];
            this.fetchData(file);
            
            this.$message({
                message: "选择文件" + file.name,
                type: "action",
                offset: 50,
            });
            this.setUploadedFileName(file.name);
            console.log(this.currentPage, this.pageSize);

            this.$nextTick(() => {
                this.initVirtualScroll();
            });
        },

        async handleDialogConfirm() {
            if (this.outlierRadio !== "" && this.missingRadio !== "") {
                // console.log(this.outlierRadio); // 获取选中的复选框的值
                this.dialogFormVisible = false;
                this.showTable = true;
                await this.sendPreprocessParams();
                this.fetchData();

                console.log(this.jsonData);
                this.$nextTick(() => {
                    this.initVirtualScroll();
                });

            } else {
                this.$message({
                    message: "请至少选择一个预处理方法",
                    type: "warning",
                    offset: 50,
                });
            }
        },

        // TODO: 发送预处理参数
        async sendPreprocessParams() {
            await this.request.post("/file/preprocess", this.curfile.name).then((res) => {
                    if (res.code === "200") {
                        console.log(this.curfile.name);
                    }
            });
            this.$message({
                message: "预处理成功",
                type: "success",
                offset: 50,
            });
        },
    },
};
</script>

<style lang="less">
.el-upload {
    width: 98%;
    background-color: rgb(241, 241, 241);
}

.el-upload-dragger {
    border: 3px dashed #d9d9d9;
    width: 100%;
    background-color: rgb(241, 241, 241);
}

.el-upload-list {
    display: flex;
    justify-content: space-between;
}

.table-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h1 {
        font-size: 18px;
        font-weight: 800;
        letter-spacing: 5px;
    }
}

// 大于800px
@media only screen and (min-width: 800px) {
    .totalinfocontainer {
        .M_upload {
            display: none;
        }

        .el-dialog__body {
            padding: 0;
        }

        .form-row {
            display: flex;
            align-items: center;
            flex-direction: column;
            margin: 10px;
            align-items: center;
            justify-content: center;
        }

        .tag {
            width: 120px;
            margin-bottom: 5px;
        }

        .el-radio-group {
            margin-bottom: 5px;
        }

        .el-radio-button__inner {
            font-size: 12px;
            padding: 10px;
        }

        .el-button.is-round {
            padding: 8px 19px;
        }

        .el-dialog__footer {
            padding: 10px 20px 10px;
        }
    }
}

// 小于800px
@media only screen and (max-width: 800px) {
    ._totalinfocontainer {
        .PC_upload {
            display: none;
        }

        .el-dialog__title {
            font-size: 14px;
        }

        .el-dialog {
            width: 60% !important;
        }

        .el-dialog__body {
            padding: 10px;
        }

        .tag {
            width: 120px;
            margin-bottom: 4px;
        }

        .el-radio-group {
            margin-bottom: 5px;
        }

        .el-radio-button__inner {
            font-size: 12px;
            padding: 10px;
        }

        .el-button.is-round {
            padding: 8px 19px;
        }

        .el-dialog__footer {
            padding: 10px 20px 10px;
        }
    }
}
</style>
