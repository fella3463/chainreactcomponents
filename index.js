// 引入所需模块
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const cors = require('cors');
const dotenv = require('dotenv').config();
const { ethers } = require('ethers');

// 初始化 Express 应用
const app = express();

// 应用中间件
app.use(cors());
app.use(bodyParser.json());

// 连接到 MongoDB 数据库
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log('Connected to db'))
  .catch((err) => console.error(err));

// 初始化 Web3
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));
const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);

// 示例智能合约配置
const contractAddress = '0x...'; // 您的合约地址
const contractABI = [...]; // 您的合约ABI

// 设置路由
app.get('/', (req, res) => {
  res.send('Welcome to the blockchain API server');
});

// 获取智能合约的状态
app.get('/contract-status', async (req, res) => {
  try {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const status = await contract.methods.status().call(); // 假设智能合约有一个名为'status'的方法
    res.json({ status });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching contract status');
  }
});

// 使用 ethers 读取账户余额
app.get('/balance/:address', async (req, res) => {
  try {
    const balance = await provider.getBalance(req.params.address);
    res.json({ balance: ethers.utils.formatEther(balance) });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching balance');
  }
});

// 设置监听端口
const PORT = process.env.PORT || 300
