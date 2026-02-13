document.addEventListener("DOMContentLoaded", () => {
  const myForm = document.getElementById("myForm");
  const hiddenInput = document.getElementById("hiddenInput");
  const selectBox = document.getElementById("selectBox");
  const optionsList = document.getElementById("optionsList");
  const selectedValueText = document.getElementById("selectedValue");
  const consentCheck = document.getElementById("consentCheck");

  // 表單欄位
  const nameEl = document.querySelector('input[name="entry.1161408526"]');
  const phoneEl = document.querySelector('input[name="entry.1482757782"]');
  const emailEl = document.querySelector('input[name="entry.1863658734"]');
  const taxIdEl = document.querySelector('input[name="entry.592871638"]');
  const consentLabel = document.querySelector(".consent-label");

  // Modal 元素
  const modal = document.getElementById("consentModal");
  const openBtn = document.getElementById("openModal");
  const closeBtn = document.getElementById("closeModal");

  selectBox.addEventListener("click", (e) => {
    e.stopPropagation(); // 防止點擊冒泡到 document
    selectBox.classList.toggle("open");
  });

  optionsList.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", function (e) {
      e.stopPropagation();

      const val = this.getAttribute("data-value");
      const text = this.innerText;

      selectedValueText.innerText = text;
      hiddenInput.value = val;
      selectedValueText.classList.add("selected");

      // 觸發 CSS 動畫收回
      selectBox.classList.remove("open");

      // 清除錯誤狀態
      selectBox.classList.remove("select-error", "input-error");
    });
  });

  document.addEventListener("click", () => {
    selectBox.classList.remove("open");
  });

  // --- 2. Modal 彈窗邏輯 ---
  if (openBtn) {
    openBtn.onclick = () => {
      modal.classList.add("show"); // 加上 show 類別觸發動畫
    };
  }

  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.remove("show"); // 移除 show 類別縮回
    };
  }

  // 點擊背景關閉
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.classList.remove("show");
    }
  };

  phoneEl.addEventListener("input", function () {
    if (/^09\d{8}$/.test(this.value.trim())) {
      this.classList.remove("input-error");
    }
  });

  // 取得所有需要監測的輸入框與下拉選單
  const formElements = document.querySelectorAll(
    'input[type="text"], input[type="email"], input[type="tel"], select',
  );

  // --- 新增：點擊即時恢復 ---
  consentCheck.addEventListener("change", function () {
    if (this.checked) {
      consentLabel.classList.remove("error-text");
      consentLabel.style.color = "#e06c3a"; // 恢復橘色
    }
  });

  formElements.forEach((el) => {
    // 監聽 input 事件 (針對打字) 或 change 事件 (針對下拉選單)
    el.addEventListener("input", function () {
      // 只要使用者開始輸入，且目前是有紅框的狀態
      if (this.classList.contains("input-error")) {
        // 邏輯：如果你希望「有打字就先消紅框」，直接 remove 即可
        // 如果你希望「符合格式才消」，則需要套用你原本的 regex 判斷
        this.classList.remove("input-error");
      }
    });

    // 針對下拉選單 (select)，通常建議監聽 change
    if (el.tagName === "SELECT") {
      el.addEventListener("change", function () {
        if (this.value !== "") {
          this.classList.remove("input-error");
        }
      });
    }
  });

  myForm.addEventListener("submit", function (event) {
    let isValid = true;
    let errorList = []; // 改用陣列來儲存錯誤訊息，方便排版

    // 1. 姓名驗證
    if (!nameEl || nameEl.value.trim() === "") {
      nameEl.classList.add("input-error");
      isValid = false;
      errorList.push("姓名");
    } else {
      nameEl.classList.remove("input-error");
    }

    // 2. 手機驗證
    if (!/^09\d{8}$/.test(phoneEl.value.trim())) {
      phoneEl.classList.add("input-error");
      isValid = false;
      errorList.push("手機格式 (需09開頭10碼)");
    } else {
      phoneEl.classList.remove("input-error");
    }

    // 3. 信箱驗證
    if (!emailEl.value.includes("@")) {
      emailEl.classList.add("input-error");
      isValid = false;
      errorList.push("電子信箱");
    } else {
      emailEl.classList.remove("input-error");
    }

    // 4. 下拉選單驗證
    if (!hiddenInput.value) {
      selectBox.classList.add("select-error");
      isValid = false;
      errorList.push("喜愛攤位");
    } else {
      selectBox.classList.remove("select-error");
    }

    // 6. 同意書驗證 (修改版)
    if (!consentCheck.checked) {
      // 給 label 加上 error-text 類別，這會讓 CSS 裡的 ::before 變紅框
      consentLabel.classList.add("error-text");
      consentLabel.style.color = "#ff4d4d"; // 文字變紅
      isValid = false;
      errorList.push("個人資料提供同意書");
    } else {
      consentLabel.classList.remove("error-text");
      consentLabel.style.color = "#e06c3a";
    }

    if (!isValid) {
      event.preventDefault();

      if (Swal.isLoading()) {
        Swal.hideLoading();
      }

      Swal.fire({
        title: "資料尚未完成",
        html: `
    <div class="swal-custom-container">
      <p class="swal-subtitle">請修正以下項目：</p>
      <ul class="swal-error-list">
        ${errorList.map((item) => `<li class="swal-error-item">${item}</li>`).join("")}
      </ul>
    </div>
  `,
        icon: "warning",
        iconColor: "#f1b094", // 柔和橘色圖示
        showConfirmButton: true,
        confirmButtonText: "返回修改",
        confirmButtonColor: "#ef5b00", // 主題橘色
        background: "#fffcfb", // 極淡的橘粉色背景
        padding: "2.5rem",
        customClass: {
          popup: "swal-stylish-popup",
          title: "swal-stylish-title",
          confirmButton: "swal-stylish-button",
        },
      });

      return false;
    }

    if (isValid) {
      submitted = true;

      // 1. 顯示處理中視窗
      Swal.fire({
        title: "處理中...",
        text: "正在為您送出資料",
        allowOutsideClick: false,
        showConfirmButton: false,
        customClass: {
          popup: "swal-loading-popup",
          title: "swal-loading-title",
          htmlContainer: "swal-loading-content",
        },
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // 2. 設定逾時偵測（例如 8 秒）
      timeoutTimer = setTimeout(() => {
        if (submitted) {
          // 如果 8 秒後 submitted 還是 true 且頁面沒重整
          Swal.fire({
            title: "發送失敗",
            text: "網路連線不穩定或伺服器忙碌中，請稍後再試。",
            icon: "error",
            confirmButtonText: "好，我再試試",
            customClass: {
              popup: "swal-base-popup",
              title: "swal-error-title",
              confirmButton: "swal-base-button swal-error-button",
            },
          });
          submitted = false; // 重置狀態
        }
      }, 8000);
    }
  });
});
