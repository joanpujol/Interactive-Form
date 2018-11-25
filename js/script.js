// Set focus on the first text field
$("input[id=name]").focus();

// ”Job Role” section
$("input[id=other-title]").hide();

$("select[id=title]").on('change', function () {
  const valueSelected = $(this).val();
  if (valueSelected === "other") {
    $("input[id=other-title]").show();
  } else {
    $("input[id=other-title]").hide();
  }
});

// ”T-Shirt Info” section
$("select[id=design]").on('change', function () {
  const $cornflowerblue = $("option[value=cornflowerblue]");
  const $darkslategrey = $("option[value=darkslategrey]");
  const $gold = $("option[value=gold]");
  const $tomato = $("option[value=tomato]");
  const $steelblue = $("option[value=steelblue]");
  const $color = $("option[value=dimgrey]");

  const jspunsList = [$cornflowerblue, $darkslategrey, $gold];
  const heartjsList = [$tomato, $steelblue, $color];

  const valueSelected = $(this).val();
  if (valueSelected === "js puns") {
    jspunsList.forEach(colorOption => colorOption.show());
    heartjsList.forEach(colorOption => colorOption.hide());
    $("select[id=color]").val("cornflowerblue");
  } else if (valueSelected === "heart js") {
    jspunsList.forEach(colorOption => colorOption.hide());
    heartjsList.forEach(colorOption => colorOption.show());
    $("select[id=color]").val("tomato");
  } else {
    jspunsList.forEach(colorOption => colorOption.show());
    heartjsList.forEach(colorOption => colorOption.show());
    $("select[id=color]").val("cornflowerblue");
  }
});

// ”Register for Activities” section
const activityList = (function() {
  const activityTimeRegex = /[A-Za-z]+ \d+[ap]m-\d+[ap]m/g;
  const activityPriceRegex = /\$\d+/g; //includes dollar sign

  let activityList = [];
  $(".activities label").each(function (index, value) {
    let activityObject = {};
    let originalText = $(this).text();

    activityObject.name = $(this).children(":first").attr("name");

    if (originalText.match(activityTimeRegex) !== null) {
      activityObject.time = originalText.match(activityTimeRegex).toString();
    }

    let priceString = originalText.match(activityPriceRegex).toString();
    activityObject.price = parseInt(priceString.substring(1, priceString.length));

    activityObject.labelReference = $(this);
    activityObject.inputReference = $(this).children(":first")

    activityList.push(activityObject);
  });
  return activityList;
})();

let totalPrice = 0;

$('input:checkbox').change( function() {
  let clickedActivity = getClickedActivity($(this).attr("name"));
  if ($(this).is(':checked')) {
    disableOverlappingActivities(clickedActivity);
    totalPrice += clickedActivity.price;
  } else {
    enableOverlappingActivities(clickedActivity);
    totalPrice -= clickedActivity.price;
  }
  $(".total-price").text("Total: " + totalPrice);
});

function getClickedActivity(clickedActivityName) {
  return activityList.find(activity => activity.name === clickedActivityName);
}

function disableOverlappingActivities(clickedActivity) {
  activityList.forEach(activity => {
    if (activity.name !== clickedActivity.name && activity.time === clickedActivity.time ) {
      activity.labelReference.css("color", "grey");
      activity.inputReference.prop( "disabled", true);
    }
  });
}

function enableOverlappingActivities(clickedActivity) {
  activityList.forEach(activity => {
    if (activity.name !== clickedActivity.name && activity.time === clickedActivity.time ) {
      activity.labelReference.css("color", "black");
      activity.inputReference.prop( "disabled", false);
    }
  });
}

//"Payment Info" section
$("select[id=payment]").on('change', function () {
  const valueSelected = $(this).val();
  if (valueSelected === "credit card") {
    $(".credit-card").show();
    $(".paypal").hide();
    $(".bitcoin").hide();
  } else if (valueSelected === "paypal") {
    $(".credit-card").hide();
    $(".paypal").show();
    $(".bitcoin").hide();
  } else if (valueSelected === "bitcoin") {
    $(".credit-card").hide();
    $(".paypal").hide();
    $(".bitcoin").show();
  }
});

$("select[id=payment]").val("credit card");
$("option[value=select_method]").hide();
$(".paypal").hide();
$(".bitcoin").hide();

//Form validation
