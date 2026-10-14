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

let checked = false;

function verify() {
  const result = calculateChange(document.getElementById("amount").value);
  document.getElementById("result").value = result.message;
  checked = result.valid;
}

function send() {
  if (checked) {
    document.getElementById("UserEnter").submit();
  } else {
    alert("Сначала выполните расчет.");
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    const amountField = document.getElementById("amount");
    const calculateButton = document.getElementById("calculate");
    const sendButton = document.getElementById("send-task");

    calculateButton.addEventListener("click", verify);
    sendButton.addEventListener("click", send);

    amountField.addEventListener("input", function () {
      checked = false;
    });
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { calculateChange: calculateChange };
}
