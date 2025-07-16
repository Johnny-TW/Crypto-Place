const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001';

async function testAuthAPI() {
  try {
    console.log('=== 測試登入 API ===');

    const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: process.env.TEST_USER_EMAIL || 'Johnny_Yeh@wistron.com',
      password: process.env.TEST_USER_PASSWORD || '123456',
    });

    console.log('登入成功！');
    console.log('Token:', loginResponse.data.access_token);
    console.log('User 資料:', loginResponse.data.user);

    const token = loginResponse.data.access_token;

    console.log('\n=== 測試 Profile API ===');

    const profileResponse = await axios.get(
      `${API_BASE_URL}/api/auth/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log('Profile API 成功！');
    console.log('完整用戶資料:', profileResponse.data);

    const user = profileResponse.data;
    console.log('=== 檢查員工資料完整性 ===');
    console.log('中文名稱:', user.chName);
    console.log('英文名稱:', user.enName);
    console.log('員工編號:', user.emplId);
    console.log('職位:', user.jobTitle);
    console.log('部門:', user.deptDescr);
    console.log('電話:', user.phone);
    console.log('辦公室:', user.office);
  } catch (error) {
    console.error('❌ API 測試失敗:', error.response?.data || error.message);
  }
}

testAuthAPI();
