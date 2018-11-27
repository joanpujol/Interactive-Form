// Sets focus on the first text field
$("input[id=name]").focus();

// *** ”Job Role” section ***

// Hides the "Other" input
$("input[id=other-title]").hide();

// I decided to add the placeholder directly to the html to accomplish the Progressive Enhancement requisite
// $("input[id=other-title]").attr("placeholder", "Your Job Role");

// A text field will be revealed when the "Other" option is selected from the "Job Role" drop down menu.
$("select[id=title]").on('change', function () {
  const $valueSelected = $(this).val();
  if ($valueSelected === "other") {
    $("input[id=other-title]").show();
  } else {
    $("input[id=other-title]").hide();
  }
});

// *** ”T-Shirt Info” section ***

// Hides the "Color" label
$(".colors").hide();

// The T-Shirt "Color" menu, only displays the color options that match the design selected in the "Design" menu.
// and the "Color" label and select menu is hidden until a T-Shirt design is selected from the "Design" menu
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
    showDesignColorSection(true);
    jspunsList.forEach($colorOption => $colorOption.show());
    heartjsList.forEach($colorOption => $colorOption.hide());
    $("select[id=color]").val("cornflowerblue");
  } else if (valueSelected === "heart js") {
    showDesignColorSection(true);
    jspunsList.forEach($colorOption => $colorOption.hide());
    heartjsList.forEach($colorOption => $colorOption.show());
    $("select[id=color]").val("tomato");
  } else {
    showDesignColorSection(false);
  }
});

// This function Hides the "Color" label and select menu until a T-Shirt design is selected from the "Design" menu
function showDesignColorSection(bool) {
  const $colors = $(".colors");
  if(bool) {
    $colors.show();
  } else {
    $colors.hide();
  }
}

// *** ”Register for Activities” section ***

// This part models the activities section as a collection of "activity objects" stored inside "activityList"
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

    activityObject.$labelReference = $(this);
    activityObject.$inputReference = $(this).children(":first")

    activityList.push(activityObject);
  });
  return activityList;
})();


// This variable holds the total price of the ticket, based on the selected workshops
let totalPrice = 0;

// I only allow a workshop at the same day and time
// When a user unchecks an activity, I make sure that competing activities (if there are any) are no longer disabled.
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

// Gets the activity object of the clicked activity checkbox
function getClickedActivity(clickedActivityName) {
  return activityList.find(activity => activity.name === clickedActivityName);
}

// Disables competing activities
function disableOverlappingActivities(clickedActivity) {
  activityList.forEach(activity => {
    if (activity.name !== clickedActivity.name && activity.time === clickedActivity.time ) {
      activity.$labelReference.css("color", "grey");
      activity.$inputReference.prop( "disabled", true);
    }
  });
}

// Enables competing activities
function enableOverlappingActivities(clickedActivity) {
  activityList.forEach(activity => {
    if (activity.name !== clickedActivity.name && activity.time === clickedActivity.time ) {
      activity.$labelReference.css("color", "black");
      activity.$inputReference.prop( "disabled", false);
    }
  });
}

// *** "Payment Info" section ***

// Displays payment sections based on the payment option chosen in the select menu.
$("select[id=payment]").on('change', function () {
  const $valueSelected = $(this).val();
  if ($valueSelected === "credit card") {
    $(".credit-card").show();
    $(".paypal").hide();
    $(".bitcoin").hide();
  } else if ($valueSelected === "paypal") {
    $(".credit-card").hide();
    $(".paypal").show();
    $(".bitcoin").hide();
  } else if ($valueSelected === "bitcoin") {
    $(".credit-card").hide();
    $(".paypal").hide();
    $(".bitcoin").show();
  }
});

// The "Credit Card" payment option is selected by default and the other options are hidden
$("select[id=payment]").val("credit card");
$("option[value=select_method]").hide();
$(".paypal").hide();
$(".bitcoin").hide();

// *** Form validation ***

//Real time name Input validation
let $nameInput = $("input[id=name]");
let $nameError = $("#name-error");
$("input[id=name]").on('keyup', function() {
  if(isValidName($nameInput.val())) {
    $nameError.text("");
    $nameInput.removeClass("error");
  } else {
    $nameError.text("Name field must at least contain 1 character");
    $nameInput.addClass("error");
  }
});

// Real time email Input validation
// The error appears as the user begins to type, and disappears as soon as the user has entered a complete and correctly formatted email address.
let $emailInput = $("input[id=mail]");
let $emailError = $("#mail-error");
$("input[id=mail]").on('keyup', function() {
  if(isValidEmail($emailInput.val())) {
    $emailError.text("");
    $emailInput.removeClass("error");
  } else {
    $emailError.text("Must be a valid email address");
    $emailInput.addClass("error");
  }
});

// If any validation errors exist, the user is prevented from submitting the form and
// some kind of indication is provided when there’s a validation error.
$("form").submit( function(event) {

  // Validates name input once form is submited
  let $nameInput = $("input[id=name]");
  if(!isValidName($nameInput.val())) {
    event.preventDefault();
    $nameError.text("Name field must at least contain 1 character");
    $nameInput.addClass("error");
  } else {
    $nameError.text("");
    $nameInput.removeClass("error");
  }

  // Validates email input once form is submited
  let $emailInput = $("input[id=mail]");
  if(!isValidEmail($emailInput.val())) {
    event.preventDefault();
    $emailError.text("Must be a valid email address");
    $emailInput.addClass("error");
  } else {
    $emailError.text("");
    $emailInput.removeClass("error");
  }

  // Validates that at least one activity is checked
  let $activitiesError = $("#activities-error");
  let $activitiesCheckbox = $(".activitties-checkbox");
  if(isOneActivityChecked()) {
    $activitiesError.text("");
    $activitiesCheckbox.removeClass("error");
  } else {
    event.preventDefault();
    $activitiesError.text("At least one activity must be checked");
    $activitiesCheckbox.addClass("error");
  }

  // Checks if the payment option is credit card and if the credit card is valid, if not the form can't be submited
  if ($("#payment").val() === "credit card" && !isValidCreditCard()) {
    event.preventDefault();
  }
});

// Validates name input
function isValidName(name) {
  if(name.length === 0) {
    return false;
  } else {
    return true;
  }
}

// Validates email input
function isValidEmail(email) {
  // Credit to https://emailregex.com/ for this regular expression
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

// Validates activity checkbox section
function isOneActivityChecked() {
  let isOneActivityChecked = false;
  activityList.forEach(activity => {
    if (activity.$inputReference.is(':checked')) {
      isOneActivityChecked = true;
    }
  });
  return isOneActivityChecked;
}

// Validates credit card inputs (number, zip and cvv) and
// some kind of indication is provided when there’s a validation error.
function isValidCreditCard() {
  $creditCardNumber = $("input[id=cc-num]");
  $creditCardZipCode = $("input[id=zip]");
  $creditCardCVV = $("input[id=cvv]");

  let returnValue = true;

  const $ccNumberError = $("#cc-num-error");

  //Validates credit card number
  if(isNumberAndMatchesLength($creditCardNumber.val(), 13, 16)) {
    $ccNumberError.text("");
    $creditCardNumber.removeClass("error");
  } else {
    // More information is provided depending on the error. (Conditional Error Message)
    if ($creditCardNumber.val().length === 0) {
      $ccNumberError.text("Please enter a credit card number.");
    } else {
      $ccNumberError.text("Please enter a number that is between 13 and 16 digits long.");
    }
    $creditCardNumber.addClass("error");
    returnValue = false;
  }

  const $zipError = $("#zip-error");

  // Validates credit card zip number
  if(isNumberAndMatchesLength($creditCardZipCode.val(), 5, 5)) {
    $zipError.text("");
    $creditCardZipCode.removeClass("error");
  } else {
    $zipError.text("Please enter a number that is 5 digits long.");
    $creditCardZipCode.addClass("error");
    returnValue = false;
  }

  const $cvvError = $("#cvv-error");

  // Validates credit card CVV number
  if(isNumberAndMatchesLength($creditCardCVV.val(), 3, 3)) {
    $cvvError.text("");
    $creditCardCVV.removeClass("error");
  } else {
    $cvvError.text("Please enter a number that is 3 digits long.");
    $creditCardCVV.addClass("error");
    returnValue = false;
  }
  return returnValue;
}

// Helper function to check that a number that matches a certain length is provided
function isNumberAndMatchesLength(number, min, max) {
  // Credit to Jeff Hillman for providing a regex to match special symbols
  // Source: https://stackoverflow.com/questions/8359566/regex-to-match-symbols
  if(/[a-zA-Z-!¡$%^&*()_+|~=`{}\[\]:";'<>?¿,.\/]/.test(number)) {
    return false;
  } else {
    return (/\d+/.test(number) && number.toString().length >= min && number.toString().length <= max);
  }
}
