<template>
  <el-table :data="list" style="width: 90%;padding-top: 15px;">
    <el-table-column label="文件名" min-width="100" align="center">
      <template slot-scope="scope">
        {{ scope.row.filename}}
      </template>
    </el-table-column>
    <el-table-column label="文件大小" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.filesize}}kb
      </template>
    </el-table-column>
    <el-table-column label="预处理方法" width="400" align="center">
      <template slot-scope="scope">
        {{ scope.row.method1}} + {{ scope.row.method2}}
      </template>
    </el-table-column>
    <el-table-column label="处理时间" width="250" align="center">
      <template slot-scope="scope">
        {{ scope.row.uploadTime }}
      </template>
    </el-table-column>
    <el-table-column label="下载" width="100" align="center">
      <el-button size="mini" type="primary" icon="el-icon-download" circle></el-button>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { "filename": "03.csv", "method1": "线性插值", "method2": "孤立森林", "filesize": 2047, "uploadTime": "2023-08-10 14:25:06" },
        { "filename": "11.csv", "method1": "线性插值", "method2": "KNN", "filesize": 1135, "uploadTime": "2023-08-10 14:28:18" },
        { "filename": "07.csv", "method1": "XgBoost", "method2": "PCA", "filesize": 1420, "uploadTime": "2023-08-10 14:31:22" },
        { "filename": "15.csv", "method1": "简单填充", "method2": "孤立森林", "filesize": 7333, "uploadTime": "2023-08-10 14:34:45" },
        { "filename": "10.csv", "method1": "线性插值", "method2": "KNN", "filesize": 1207, "uploadTime": "2023-08-10 14:37:33" },
        { "filename": "14.csv", "method1": "线性插值", "method2": "PCA", "filesize": 4859, "uploadTime": "2023-08-10 14:43:55" },
        { "filename": "02.csv", "method1": "简单填充", "method2": "孤立森林", "filesize": 1145, "uploadTime": "2023-08-10 14:46:10" },
        { "filename": "12.csv", "method1": "线性插值", "method2": "KNN", "filesize": 1076, "uploadTime": "2023-08-10 14:49:05" },
        { "filename": "05.csv", "method1": "线性插值", "method2": "孤立森林", "filesize": 1121, "uploadTime": "2023-08-10 14:55:20" },
        { "filename": "13.csv", "method1": "简单填充", "method2": "DBSCAN", "filesize": 3973, "uploadTime": "2023-08-10 14:58:26" },
        { "filename": "09.csv", "method1": "线性插值", "method2": "KNN", "filesize": 1413, "uploadTime": "2023-08-10 15:01:32" },
        { "filename": "18.csv", "method1": "XgBoost", "method2": "PCA", "filesize": 1420, "uploadTime": "2023-08-10 15:04:38" },
        { "filename": "04.csv", "method1": "线性插值", "method2": "孤立森林", "filesize": 1135, "uploadTime": "2023-08-10 15:07:44" },
        { "filename": "08.csv", "method1": "简单填充", "method2": "DBSCAN", "filesize": 1227, "uploadTime": "2023-08-10 15:10:50" },
        { "filename": "01.csv", "method1": "线性插值", "method2": "KNN", "filesize": 1342, "uploadTime": "2023-08-10 15:13:56" },
        { "filename": "20.csv", "method1": "XgBoost", "method2": "PCA", "filesize": 2117, "uploadTime": "2023-08-10 15:16:02" },
        { "filename": "16.csv", "method1": "线性插值", "method2": "孤立森林", "filesize": 2007, "uploadTime": "2023-08-10 15:19:08" },
        { "filename": "17.csv", "method1": "简单填充", "method2": "DBSCAN", "filesize": 7482, "uploadTime": "2023-08-10 15:22:14" }
      ]
    }
  }
}
</script>
