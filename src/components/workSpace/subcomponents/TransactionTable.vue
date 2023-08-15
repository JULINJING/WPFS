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
    <el-table-column label="数据起止时间" width="400" align="center">
      <template slot-scope="scope">
        {{ scope.row.startTime}} 到 {{ scope.row.endTime}}
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
      <el-button size="mini" type="primary" icon="el-icon-upload" circle></el-button>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { filename: '03.csv', startTime: '2020/01/01 00:00:00', endTime: '2021/05/31 23:45:00', filesize: 2346, status: 'success', uploadTime: '2023-08-10 14:25:06' },
        { filename: '11.csv', startTime: '2021/11/01 00:00:00', endTime: '2022/06/30 23:45:00', filesize: 1532, status: 'success', uploadTime: '2023-08-10 14:28:18' },
        { filename: '07.csv', startTime: '2019/09/01 00:00:00', endTime: '2020/09/30 23:45:00', filesize: 1832, status: 'success', uploadTime: '2023-08-10 14:31:22' },
        { filename: '15.csv', startTime: '2021/04/02 00:00:00', endTime: '2022/06/30 23:45:00', filesize: 7742, status: 'success', uploadTime: '2023-08-10 14:34:45' },
        { filename: '10.csv', startTime: '2021/11/01 00:00:00', endTime: '2022/06/30 23:45:00', filesize: 1600, status: 'success', uploadTime: '2023-08-10 14:37:33' },
        { filename: '06.csv', startTime: '2022/01/01 00:00:00', endTime: '2022/12/31 23:45:00', filesize: 1923, status: 'pending', uploadTime: '2023-08-10 14:40:18' },
        { filename: '14.csv', startTime: '2022/01/02 00:00:00', endTime: '2022/05/31 23:45:00', filesize: 5372, status: 'success', uploadTime: '2023-08-10 14:43:55' },
        { filename: '02.csv', startTime: '2020/10/01 00:00:00', endTime: '2021/10/31 23:45:00', filesize: 1593, status: 'success', uploadTime: '2023-08-10 14:46:10' },
        { filename: '12.csv', startTime: '2021/11/01 00:00:00', endTime: '2022/06/30 23:45:00', filesize: 1544, status: 'success', uploadTime: '2023-08-10 14:49:05' },
        { filename: '19.csv', startTime: '2022/01/01 00:00:00', endTime: '2022/12/31 23:45:00', filesize: 1982, status: 'pending', uploadTime: '2023-08-10 14:52:16' },
        { filename: '05.csv', startTime: '2022/01/02 00:00:00', endTime: '2022/05/31 23:45:00', filesize: 1456, status: 'success', uploadTime: '2023-08-10 14:55:20' },
        { filename: '13.csv', startTime: '2021/04/02 00:00:00', endTime: '2022/04/30 23:45:00', filesize: 4367, status: 'success', uploadTime: '2023-08-10 14:58:26' },
        { filename: '9.csv', startTime: '2021/11/1 0:00:00', endTime:'2022/6/30 23:45:00', filesize: 1872, status: 'success', uploadTime: '2023-08-10 15:01:32' },
        { filename: '18.csv', startTime: '2022/01/02 0:00:00', endTime:'2022/05/31 23:45:00', filesize: 1853, status: 'success', uploadTime: '2023-08-10 15:04:38' },
        { filename: '4.csv', startTime: '2021/11/1 0:00:00', endTime:'2022/6/30 23:45:00', filesize: 1555, status: 'success', uploadTime: '2023-08-10 15:07:44' },
        { filename: '8.csv', startTime: '2021/11/1 0:00:00', endTime:'2022/6/30 23:45:00', filesize: 1666, status: 'success', uploadTime: '2023-08-10 15:10:50' },
        { filename: '1.csv', startTime: '2021/11/1 0:00:00', endTime:'2022/6/30 23:45:00', filesize: 1777, status: 'success', uploadTime: '2023-08-10 15:13:56' },
        { filename: '20.csv', startTime: '2020/10/01 0:00:00', endTime:'2021/10/31 23:45:00', filesize: 2549, status: 'success', uploadTime: '2023-08-10 15:16:02' },
        { filename: '16.csv', startTime: '2020/10/02 0:00:00', endTime:'2021/10/31 23:45:00', filesize: 2418, status: 'success', uploadTime: '2023-08-10 15:19:08' },
        { filename: '17.csv', startTime: '2021/04/02 0:00:00', endTime:'2022/4/30 23:45:00', filesize: 7877, status: 'success', uploadTime: '2023-08-10 15:22:14' }
      ]
    }
  }
}
</script>
