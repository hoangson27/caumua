# 🚀 HƯỚNG DẪN DEPLOY LÊN NETLIFY

## 📋 Chuẩn Bị

1. **Build project:**
```bash
npm run build
```

2. **Kiểm tra folder `dist` đã được tạo**

## 🌐 Deploy lên Netlify

### Cách 1: Drag & Drop (Dễ nhất - 2 phút)

1. **Vào https://netlify.com**
2. **Đăng ký/Đăng nhập** (có thể dùng GitHub)
3. **Kéo thả folder `dist`** vào vùng "Want to deploy a new site without connecting to Git?"
4. **Đợi deploy xong** (30-60 giây)
5. **Website live!** URL mẫu: `https://amazing-name-123456.netlify.app`

### Cách 2: Netlify CLI (Nâng cao)

1. **Cài Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Login:**
```bash
netlify login
```

3. **Deploy:**
```bash
netlify deploy --prod --dir=dist
```

## 🎯 Tùy Chỉnh Tên Website

1. **Vào dashboard Netlify**
2. **Site settings > Change site name**
3. **Đổi thành:** `cau-tanh-mua` 
4. **URL mới:** `https://cau-tanh-mua.netlify.app`

## 📱 Custom Domain (Tùy chọn)

### Tên domain gợi ý:
- `cau-tanh-mua.com`
- `nghi-thuc-mua.com` 
- `thien-linh.com`
- `cam-mua.vn`

### Cách thêm domain:
1. **Mua domain** tại Namecheap/GoDaddy
2. **Netlify Dashboard > Domain settings**
3. **Add custom domain**
4. **Cấu hình DNS** theo hướng dẫn Netlify
5. **SSL tự động** - Netlify lo hết!

## ⚡ Netlify Features Miễn Phí

- ✅ **SSL Certificate** tự động
- ✅ **CDN Global** siêu nhanh  
- ✅ **300GB bandwidth/tháng**
- ✅ **Unlimited sites**
- ✅ **Auto deploy** từ Git
- ✅ **Form handling**
- ✅ **Serverless functions**

## 🔄 Auto Deploy từ Git (Khuyến nghị)

1. **Push code lên GitHub:**
```bash
git add .
git commit -m "Deploy website cầu tạnh mưa"
git push origin main
```

2. **Connect với Netlify:**
   - Netlify Dashboard > New site from Git
   - Chọn GitHub repo
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Mỗi lần push code = auto deploy!** 🎉

## 📊 Monitor & Analytics

- **Netlify Analytics:** Traffic, performance
- **Google Analytics:** Chi tiết user behavior  
- **Real User Monitoring:** Core Web Vitals

---

## 🎯 URL Demo:
**https://cau-tanh-mua.netlify.app**

Chúc mừng! Website cầu tạnh mưa của bạn đã live! 🌧️✨