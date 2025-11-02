# 🔧 SỬA LỖI DEPLOY NETLIFY

## ❌ Lỗi Vừa Gặp:
```
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory
```

## ✅ Đã Sửa:

### 1. **Cập nhật netlify.toml**
- ❌ Xóa `NPM_FLAGS` gây lỗi
- ✅ Dùng `npm ci` thay vì `npm install`
- ✅ Đơn giản hóa config

### 2. **Thêm .nvmrc**
- ✅ Chỉ định Node.js v18
- ✅ Netlify sẽ tự động dùng đúng version

### 3. **Kiểm tra Files**
- ✅ `package.json` - OK
- ✅ `package-lock.json` - OK
- ✅ `netlify.toml` - Fixed
- ✅ `.nvmrc` - Added

## 🚀 Deploy Lại:

### Cách 1: Git Push
```bash
git add .
git commit -m "Fix netlify config"
git push origin main
```

### Cách 2: Manual Deploy
1. **Build lại:**
```bash
npm run build
```

2. **Kéo thả folder `dist` lên Netlify**

## 📊 Monitoring:
- **Build logs:** Netlify dashboard → Deploys
- **Success URL:** https://cau-tanh-mua.netlify.app
- **Build time:** ~1-2 phút

## 🎯 Kết Quả Mong Đợi:
```
✅ Node.js 20 installed (phù hợp với local v20.19.4)
✅ Dependencies installed
✅ Build completed  
✅ Deploy successful
✅ Website live!
```

---
**Lỗi đã được sửa! Deploy lại thôi! 🚀**