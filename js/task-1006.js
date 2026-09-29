function calculateChange(rawAmount) {
  const text = String(rawAmount).trim().replace(",", ".");

  if (text === "") {
    return { valid: false, message: "Введите денежную сумму." };
  }

  const amount = Number(text);

  if (!Number.isFinite(amount)) {
    return { valid: false, message: "Сумма должна быть числом." };
  }

  if (!Number.isInteger(amount)) {
    return { valid: false, message: "Сумма должна быть целым числом рублей без копеек." };
  }

  if (amount < 0) {
    return { valid: false, message: "Сумма не может быть отрицательной." };
  }

  if (amount % 2 !== 0) {
    return {
      valid: true,
      possible: false,
      amount: amount,
      message: "Размен невозможен: все доступные номиналы чётные, а сумма нечётная."
    };
  }

  let rest = amount;
  const counts = {};

  [500, 100, 10, 2].forEach(function (denomination) {
    counts[denomination] = Math.floor(rest / denomination);
    rest %= denomination;
  });

  return {
    valid: true,
    possible: true,
    amount: amount,
    counts: counts,
    message:
      "500 руб. — " + counts[500] + "; " +
      "100 руб. — " + counts[100] + "; " +
      "10 руб. — " + counts[10] + "; " +
      "2 руб. — " + counts[2] + "."
  };
}

function showTaskResult(result) {
  const resultBox = document.getElementById("result-box");
  const resultField = document.getElementById("result");
  const sendButton = document.getElementById("send-task");
  const queryField = document.getElementById("task-query");
  const formulation = document.getElementById("formulation").value;
  const amount = document.getElementById("amount").value;

  resultBox.textContent = result.message;
  resultField.value = result.message;

  if (result.valid) {
    resultBox.dataset.state = "success";
    sendButton.disabled = false;
    queryField.value = formulation + " Исходная сумма: " + amount + ". Результат: " + result.message;
  } else {
    resultBox.dataset.state = "error";
    sendButton.disabled = true;
    queryField.value = "";
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("task-form");
    const amountField = document.getElementById("amount");
    const calculateButton = document.getElementById("calculate");

    calculateButton.addEventListener("click", function () {
      showTaskResult(calculateChange(amountField.value));
    });

    amountField.addEventListener("input", function () {
      document.getElementById("send-task").disabled = true;
      document.getElementById("result-box").textContent = "Нажмите «Рассчитать».";
      document.getElementById("result-box").dataset.state = "";
    });

    form.addEventListener("submit", function (event) {
      const result = calculateChange(amountField.value);
      showTaskResult(result);

      if (!result.valid) {
        event.preventDefault();
      }
    });
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { calculateChange: calculateChange };
}
