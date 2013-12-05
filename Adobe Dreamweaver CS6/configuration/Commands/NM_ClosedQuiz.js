// Copyright 2008 Adobe Systems Incorporated.  All rights reserved

var HELP_DOC = "http://olo.test.twenteacademy.nl/wiki/olo/Nm_closedquiz";

var GC_ITEMS     = new GridControl("LabelValuePairs");
var TF_GROUP_NAME = new TextField("","GroupName");

//---------------   GLOBAL VARIABLES   ---------------
//var OBJECT_FILE = dw.getConfigurationPath() + '/commands/NM_ClosedQuiz.htm';
var RETURN_TAG='';
var ITEMS_GROUP_STR='';

//--------------- TEXT VARIABLES -----------------
var NM_BASENAME = "nm_ClosedQuiz";
var NM_LABELNAME = "Item";

//--------------------------------------------------------------------
// FUNCTION:
//   initializeUI
//
// DESCRIPTION:
//   prepare the dialog for user feedback
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function initializeUI()
{
  TF_GROUP_NAME.initializeUI();

  var radioLabel = NM_LABELNAME;

  var displayArr = new Array(new Array(radioLabel),
                             new Array(radioLabel)
                            );

  GC_ITEMS.setAll(displayArr);

  // generate unique radio group name, i.e.: "RadioGroup1"
  TF_GROUP_NAME.setValue( generatequizGroupName() );
  
  TF_GROUP_NAME.textControl.focus();  // set focus to radio group name
  TF_GROUP_NAME.textControl.select(); // select current group name

}

//--------------------------------------------------------------------
// FUNCTION:
//   displayHelp
//
// DESCRIPTION:
//   called when the user clicks the Help button. in this implementation,

//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function displayHelp()
{
   // Replace the following call if you are modifying this file for your own use.
   dwscripts.displayDWHelp(HELP_DOC);
}

//--------------------------------------------------------------------
// FUNCTION:
//   commandButtons
//
// DESCRIPTION:
//   dialog button control
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function commandButtons()
{
  return new Array(MM.BTN_OK,"clickedOK()",
                   MM.BTN_Cancel,"window.close()",
                   MM.BTN_Help,"displayHelp()");
}


//--------------------------------------------------------------------
// FUNCTION:
//   clickedOK
//
// DESCRIPTION:
//   called when the user clicks OK, manages radio group insertion and error messages
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function clickedOK()
{
  var labelValueArr = GC_ITEMS.getAll();
  var quizGroupName = TF_GROUP_NAME.getValue();
  var canApplyMsg = "";
  
  canApplyMsg = checkForLabelsAndValues(labelValueArr);
  
  if (!canApplyMsg && !quizGroupName)
    canApplyMsg = MM.MSG_NeedAradioGroupName;
  else
    quizGroupName = dwscripts.entityNameEncode(quizGroupName);
  
  if (canApplyMsg)
  {
    alert(canApplyMsg);
    return;
  }
  
    // Do not allow the checked attribute to be set from the form object version
  //   of the radio group.
  var selectValueEqualTo = ""; 
  var insertionStr = createItemsGroupString(quizGroupName,selectValueEqualTo,labelValueArr);
  
  ITEMS_GROUP_STR = insertionStr;
  
  //var dom = dw.getDocumentDOM();
  //dom.insertHTML(ITEMS_GROUP_STR, false);

  RETURN_TAG = ITEMS_GROUP_STR;

  window.close();
}



//--------------------------------------------------------------------
// FUNCTION:
//   updateUI
//
// DESCRIPTION:
//   update the UI based on user feedback.
//
// ARGUMENTS:
//   theArg -- label for element or elements to update
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function updateUI(theArg)
{
  // if user clicks the "-" button, delete the currently selected item
  if (theArg == "deleteButton")
  {
    GC_ITEMS.del();
  }
}


//--------------------------------------------------------------------
// FUNCTION:
//   generatequizGroupName
//
// DESCRIPTION:
//   generate unique radio group name
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   unique name
//--------------------------------------------------------------------
function generatequizGroupName()
{
  var baseName = NM_BASENAME;
  return dwscripts.getUniqueNameForTag("DIV",baseName);
}



//--------------------------------------------------------------------
// FUNCTION:
//   createRadioGroupString
//
// DESCRIPTION:
//   create the text string to insert into the document
//
// ARGUMENTS:
//   groupName (string), isTable (boolean), selectValueEqualTo (string), labelValueArr(array)
//
// RETURNS:
//   string to insert into the document
//--------------------------------------------------------------------
function createItemsGroupString(groupName,selectValueEqualTo,labelValueArr)
{
  // labelValueArr is n items long, where n equal the number of radio buttons
  // Each nth item is an array in which [0] is the label and [1] is the value
  
  // Create a third item in the array that contains the checked string or
  // an empty string if there is no checked string
  //addCheckedInformation(labelValueArr);

  var nItems = labelValueArr.length;
  var i;
  var insertionStr = "";
  var paramObj = new Object();


  paramObj.ItemAnswer = false;
  paramObj.ItemTip = "";
  paramObj.ItemId = groupName + "_";
  paramObj.RadioName = groupName;
  paramObj.RadioId = "inp_" + groupName + "_";
  //var radioButtonStr = "";

  for (i=0;i<nItems;i++)
  {
    paramObj.RadioLabel = labelValueArr[i][0];

    insertionStr += getItemString(paramObj,i);
  }

  return ( addOuterTag(insertionStr,groupName) );
}



//--------------------------------------------------------------------
// FUNCTION:
//   addCheckedInformation
//
// DESCRIPTION:
//   adds the checked attribute as a third item in the multi-dimensional array
//   determines the correct type of checked attribute (static or dynamic), and
//   builds up the correct string for either case
//
// ARGUMENTS:
//   labelValueArr (multi-dimensional array),selectValueEqualTo (string)
//
// RETURNS:
//   nothing -- the multi-dimensional array is passed by reference
//--------------------------------------------------------------------
/*
function addCheckedInformation(labelValueArr)
{
  var nItems = labelValueArr.length;
  var i;

  for (i=0; i<nItems; i++)
  {
    labelValueArr[i][1] = "";
  }  
}
*/

//--------------------------------------------------------------------
// FUNCTION:
//   addOuterTag
//
// DESCRIPTION:
//   adds table around current string, based on user preference
//
// ARGUMENTS:
//   theStr -- string to wrap outer tag around
//   isTable -- boolean -- if false, it is assumed that layout is line breaks
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function addOuterTag(theStr,groupName)
{
  return "<div class='nm_ClosedQuiz' id='" + groupName + "'>" + theStr + "</div>";
}



//--------------------------------------------------------------------
// FUNCTION:
//   getRadioButtonString
//
// DESCRIPTION:
//   get the string which represents one radio button
//
// ARGUMENTS:
//   paramObj -- object with name/value properties
//
// RETURNS:
//   string which represents one html element radio button
//--------------------------------------------------------------------
function getItemString(paramObj,itemNum)
{
  var itemStr = '<div class="nm_qItem" id="@@ItemId@@" answer="@@ItemAnswer@@" tip="@@ItemTip@@"><input type="radio" name="@@RadioName@@" id="@@RadioId@@" /><label class="input" for="@@RadioIdFor@@">@@RadioLabel@@</label></div>';

  itemStr = itemStr.replace(/@@ItemId@@/,paramObj.ItemId + itemNum);
  itemStr = itemStr.replace(/@@ItemAnswer@@/,paramObj.ItemAnswer);
  itemStr = itemStr.replace(/@@ItemTip@@/,paramObj.ItemTip);
  itemStr = itemStr.replace(/@@RadioName@@/,paramObj.RadioName);
  itemStr = itemStr.replace(/@@RadioValue@@/,paramObj.RadioValue);
  itemStr = itemStr.replace(/@@RadioId@@/,paramObj.RadioId + itemNum);
  itemStr = itemStr.replace(/@@RadioIdFor@@/,paramObj.RadioId + itemNum);
  itemStr = itemStr.replace(/@@RadioLabel@@/,paramObj.RadioLabel);

  return itemStr;
}



//--------------------------------------------------------------------
// FUNCTION:
//   checkForLabelsAndValues
//
// DESCRIPTION:
//   checks a multi-dimensional array to verify its contents
//   verifies that there is at least one item, and that all items are complete
//
// ARGUMENTS:
//   theArr - multi-dimensional array
//
// RETURNS:
//   empty string if everything is fine, and error message string if it is not
//--------------------------------------------------------------------
// returns empty string if valid, and error message if not valid
function checkForLabelsAndValues(theArr)
{
  var retVal = "";
  var nItems = theArr.length;
  var i;
  
  if (!nItems || nItems == 0)
  {
    retVal = "A quiz contains at least one item.";
  }
  
  if (!retVal)
  {
    for (i=0;i<nItems;i++)
    {
      if (theArr[i][0] == "")
      {
        retVal = "You did not specify a label.";
        break;
      }
    }
  }
  
  return retVal;
}

//---------------     API FUNCTIONS    ---------------

function isDOMRequired()
{
  // Return false, indicating that this object is available in code view.
  return false;
}

function createComponentStr()
{
  return RETURN_TAG;
}
