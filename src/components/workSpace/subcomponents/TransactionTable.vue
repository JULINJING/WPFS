<template>
    <el-table :data="list" style="width: 90%;padding-top: 15px;">
        <el-table-column label="文件名" min-width="100" align="center">
            <template slot-scope="scope">
                {{ scope.row.name }}
            </template>
        </el-table-column>
        <el-table-column label="文件大小" width="195" align="center">
            <template slot-scope="scope">
                {{ scope.row.filesize }}kb
            </template>
        </el-table-column>
        <el-table-column label="数据起止时间" width="400" align="center">
            <template slot-scope="scope">
                {{ scope.row.startTime }} 到 {{ scope.row.endTime }}
            </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
            <template slot-scope="{row}">
                <el-tag :type="row.status">
                    {{ row.status }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="上传时间" width="250" align="center">
            <template slot-scope="scope">
                {{ scope.row.uploadTime }}
            </template>
        </el-table-column>
        <el-table-column label="选择" width="100" align="center">
            <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-upload" circle @click="backToUpload(scope.row)"></el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
    data() {
        return {
            list: [
                { name: '03.csv', startTime: '2020/01/01 00:00:00', endTime: '2021/05/31 23:45:00', filesize: 2346, status: 'success', uploadTime: '2023-08-10 14:25:06' },
                { name: '11.csv', startTime: '2021/11/01 00:00:00', endTime: '2022/06/30 23:45:00', filesize: 1532, status: 'success', uploadTime: '2023-08-10 14:28:18' },
                { name: '07.csv', startTime: '2019/09/01 00:00:00', endTime: '2020/09/30 23:45:00', filesize: 1832, status: 'success', uploadTime: '2023-08-10 14:31:22' },
                { name: '15.csv', startTime: '2021/04/02 00:00:00', endTime: '2022/06/30 23:45:00', filesize: 7742, status: 'success', uploadTime: '2023-08-10 14:34:45' },
                { name: '10.csv', startTime: '2021/11/01 00:00:00', endTime: '2022/06/30 23:45:00', filesize: 1600, status: 'success', uploadTime: '2023-08-10 14:37:33' },
                { name: '06.csv', startTime: '2022/01/01 00:00:00', endTime: '2022/12/31 23:45:00', filesize: 1923, status: 'pending', uploadTime: '2023-08-10 14:40:18' },
                { name: '14.csv', startTime: '2022/01/02 00:00:00', endTime: '2022/05/31 23:45:00', filesize: 5372, status: 'success', uploadTime: '2023-08-10 14:43:55' },
                { name: '02.csv', startTime: '2020/10/01 00:00:00', endTime: '2021/10/31 23:45:00', filesize: 1593, status: 'success', uploadTime: '2023-08-10 14:46:10' },
                { name: '12.csv', startTime: '2021/11/01 00:00:00', endTime: '2022/06/30 23:45:00', filesize: 1544, status: 'success', uploadTime: '2023-08-10 14:49:05' },
                { name: '19.csv', startTime: '2022/01/01 00:00:00', endTime: '2022/12/31 23:45:00', filesize: 1982, status: 'pending', uploadTime: '2023-08-10 14:52:16' },
                { name: '05.csv', startTime: '2022/01/02 00:00:00', endTime: '2022/05/31 23:45:00', filesize: 1456, status: 'success', uploadTime: '2023-08-10 14:55:20' },
                { name: '13.csv', startTime: '2021/04/02 00:00:00', endTime: '2022/04/30 23:45:00', filesize: 4367, status: 'success', uploadTime: '2023-08-10 14:58:26' },
                { name: '09.csv', startTime: '2021/11/01 00:00:00', endTime: '2022/06/30 23:45:00', filesize: 1872, status: 'success', uploadTime: '2023-08-10 15:01:32' },
                { name: '18.csv', startTime: '2022/01/02 00:00:00', endTime: '2022/05/31 23:45:00', filesize: 1853, status: 'success', uploadTime: '2023-08-10 15:04:38' },
                { name: '04.csv', startTime: '2021/11/01 00:00:00', endTime: '2022/06/30 23:45:00', filesize: 1555, status: 'success', uploadTime: '2023-08-10 15:07:44' },
                { name: '08.csv', startTime: '2021/11/01 00:00:00', endTime: '2022/06/30 23:45:00', filesize: 1666, status: 'success', uploadTime: '2023-08-10 15:10:50' },
                { name: '01.csv', startTime: '2021/11/01 00:00:00', endTime: '2022/06/30 23:45:00', filesize: 1777, status: 'success', uploadTime: '2023-08-10 15:13:56' },
                { name: '20.csv', startTime: '2020/10/01 00:00:00', endTime: '2021/10/31 23:45:00', filesize: 2549, status: 'success', uploadTime: '2023-08-10 15:16:02' },
                { name: '16.csv', startTime: '2020/10/02 00:00:00', endTime: '2021/10/31 23:45:00', filesize: 2418, status: 'success', uploadTime: '2023-08-10 15:19:08' },
                { name: '17.csv', startTime: '2021/04/02 00:00:00', endTime: '2022/04/30 23:45:00', filesize: 7877, status: 'success', uploadTime: '2023-08-10 15:22:14' }
            ]
        }
    },
    methods: {
        ...mapState('global', ['uploadedFileList']),
        ...mapMutations('global', ["setUploadedFileList"]),

        backToUpload(selectedRow) {
            this.$router.push('/upload');

            var selectedFile = {
                name: selectedRow.name,
                inputPeriod: selectedRow.startTime,
                forecastPeriod: selectedRow.endTime,
            };

            var fileList = this.$store.state.global.uploadedFileList;
            if (!fileList.includes(selectedFile.name)) {
                fileList.push(selectedFile);
            }

            this.setUploadedFileList(fileList);
        }
    }
}
</script>
