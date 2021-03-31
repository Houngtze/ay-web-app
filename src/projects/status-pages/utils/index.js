import qs from 'querystringify';

export function parseReturnUrl($route) {
  // 特别留意，使用 hash 模式路由，回跳参数可能在 query，也可能在 hash。优先使用 query
  const returnUrl = qs.parse(window.location.search).return || $route.query.return;
  // 不支持跨域跳转
  if (returnUrl) {
    if ((returnUrl + '/').startsWith(window.location.origin + '/') || !/^(https?:)?\/\//.test(returnUrl)) {
      return returnUrl;
    }
  }
  return null;
}

export function imgCompression(file) {
  return new Promise(solve => {
    const size = Math.ceil(file.size / 1024 / 1024);
    if (size > 2) {
      // const sizeVal = Math.ceil(size / 1);
      // const sizeVal = 2 / size;
      const reader = new FileReader();
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const img = new Image();
      img.onload = function () {
        const oW = this.width;
        const oH = this.height;
        // const mH = 600;
        // const mW = 800;
        let tW = 600;
        if (oW / oH < 1) {
          tW = 400;
        }
        const tH = tW * oH / oW;
        // let tH = 800;
        // if (oW / oH > 1) {
        //   tW = 800;
        //   tH = 600;
        // }
        // canvas对图片进行缩放
        canvas.width = tW;
        canvas.height = tH;
        // 清除画布
        context.clearRect(0, 0, tW, tH);
        // 图片压缩
        context.drawImage(img, 0, 0, tW, tH);
        canvas.toBlob(bl => {
          solve(bl);
        }, 'image/*');
      };
      // 为文件读取成功设置事件
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      // 正式读取文件
      reader.readAsDataURL(file);
    } else {
      solve(file);
    }
  });
}
