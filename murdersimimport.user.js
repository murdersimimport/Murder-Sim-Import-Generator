// ==UserScript==
// @name         Murder Sim Import Generator
// @namespace    https://github.com/murdersimimport/
// @version      1.0
// @description  Usable extractor that generates an import statement for Murder Sim
// @author       anonymous
// @downloadurl https://github.com/murdersimimport/Murder-Sim-Import-Generator/blob/master/murdersimimport.user.js
// @updateurl   https://github.com/murdersimimport/Murder-Sim-Import-Generator/blob/master/murdersimimport.user.js
// @include     /^(https?://)?boards\.4chan(nel)?\.org/.*/(res|thread)/.*$/
// @include     http://orteil.dashnet.org/murdergames/
// @grant        none
// ==/UserScript==

if(window.location.href == "http://orteil.dashnet.org/murdergames/"){
    window.onload = function() {
        var meta = document.getElementsByTagName('meta');
        meta[0].name = "referrer";
        meta[0].content = "no-referrer";
    }

    var loadButton = document.createElement("INPUT");
    loadButton.type = 'button';
    loadButton.value = 'Load';
    loadButton.onclick = function() {
    }

    document.body.prepend("loadButton");

}

if(window.location.hostname == "boards.4chan.org" || window.location.hostname == "boards.4channel.org") {

    /**
      * Creates buttons for user functionality.
      * Teams allows the user to create and add teams.
      * Draw gives each post a field for name, traits, gender, team, and selection.
      * Hide removes all these fields.
      * Settings is deprecated for now until there's something that needs to be set.
      * The button labeled 'noneTraits' replaces a blank, undefined, or no traits field with none none.
      * Expected syntax for traits is '[trait1] [trait2]
      * An array is constructed that allows the script to check against the defined traits in
      * orteil's Murder Sim, so that multi-line submissions can be read and filled automatically.
      * TO-DO:
      * - Add error checking that throws if: traits are mispelled.
      * - Define a behavior for the teams method that redraws the options for each dropdown menu.
      * - Possibly add an option to use full-sized images instead of postThumb thumbnails.
      * - Indicator for possible missed posts[?], e.g., in sample where submissions x and y have invalid traits[1,2] or invalid trait[1||2]?
     */

    var teams = document.createElement("INPUT");
    var draw = document.createElement("INPUT");
    var hide = document.createElement("INPUT");
    var settings = document.createElement("INPUT");
    var generate = document.createElement("INPUT");
    var noneTraits = document.createElement("INPUT");
    noneTraits.type = "button";
    noneTraits.value = "No Traits";
    noneTraits.onclick = function() {
        var traits = document.getElementsByClassName("traitsField")
        for (var i = 0; i < traits.length; i++){
            if ((traits[i].value == "undefined" || traits[i].value == "no traits") || traits[i].value == ""){
                traits[i].value = "none none";
            }
        }
    }
    /**
      * Allows the user to simply press 'Copy' to put the import statement in keyboard.
      * May make a sister function that automatically pastes the import statement into
      * Murder Sim, may not.
     */

    var importGrab = document.createElement("INPUT");
    importGrab.type = "button";
    importGrab.value = "Copy";
    importGrab.id = "importGrab";
    importGrab.onclick = function() {
        var grabInput = document.getElementById("importState");
        grabInput.select();
        document.execCommand('copy');
    }

    var teamsList = document.createElement("INPUT");

    // Grabs posts for loops.
    var posts = document.getElementsByClassName("post reply");

    // List of teams given to the main loop to create an option for each team.
    // Also used to define teams for the import statement.  Will also be used for error-checking at generation.
    var teamList = [];

    // Array listing the traits inherent in Murder Sim in order to check for traits on third lines.
    // Will also be used for error-checking at generation.
    const originTraits = new Set(["leader", "peaceful", "sociopath", "kind", "unstable", "bulky", "meek", "naive", "devious", "seductive", "suicidal", "cute", "annoying", "scrappy", "survivalist", "rich", "inventor", "goth", "lunatic", "none"]);

    var active = 0

    // Strips empty members of the 'text' array in main loop in order to make it easier to read multiline posts [Name\n\nTraits[1,2]].
    function emptyClean(value){
        return value != '';
    }

    // Populates the teamlist value.  May deprecate in favor for normal text and have it all handled by draw?
    teams.type = "button";
    teams.id = "teams";
    teams.value = "Teams";
    teams.onclick = function() {
        active = 0;
        var teamSet = document.getElementById("teamsList").value;
        teamList = teamSet.split(", ");

    }

    teamsList.type = "text";
    // Keeping this.  May insulate it against user manipulation and simply split and push the input provided by the user into the team field,
    // in order to better prevent against removal of NOTEAM, which is a necessity for the import statement.
    teamsList.value = "NOTEAM";
    teamsList.id = "teamsList";

    /**
      * Main loop.
      * This goes through each post and converts the text from postMessage into a useable array for the parser.
      * The parser then determines whether or not the third line contains a trait, and if it doesn't, simply
      * passes the second line to the traitsfield and keeps the first line as the name.  If it does, it takes
      * that trait from the third line.
      * If conditions are met that satisfy the post as containing a submission, then the selection checkbox is
      * automatically checked.
     */

    draw.type = "button";
    draw.value = "Draw";
    draw.onclick = function(){
        var text = [];
        if (active == 0) {
            var teamSet = document.getElementById("teamsList").value;
            teamList = teamSet.split(", ");
            alert("Teams: " + teamSet);
        }
        for (var i = 0; i < posts.length; i++){
            var drawn = posts[i].getElementsByClassName("msForm");
            if (drawn[0] == undefined){
                text = posts[i].getElementsByClassName("postMessage")[0].innerText;
                text = text.replace(/\(You\)|\(OP\)|\(Cross-thread\)/g, '');
                text = text.replace(/(?:[^\A-Z\s]*)/ig, '');
                text = text.replace(/ {1,}/g, ' ');
                text = text.split(/\n/g);
                text = text.filter(emptyClean);
                for (var c = 0; c < text.length; c++){
                    text[c] = text[c].trim();
                }
                var id = i.toString();
                var genderM = document.createElement("INPUT");
                genderM.type = "radio";
                genderM.name = "gender";
                genderM.value = "0";
                genderM.title = "Male";
                genderM.className = "male";
                var genderF = document.createElement("INPUT");
                genderF.type = "radio";
                genderF.name = "gender"
                genderF.value = "1";
                genderF.title = "Female";
                genderF.className = "female";
                var genderN = document.createElement("INPUT");
                genderN.type = "radio";
                genderN.name = "gender";
                genderN.value = "2";
                genderN.title = "Neuter";
                genderN.className = "neuter";
                genderN.checked = true;
                var traitsField = document.createElement("INPUT");
                traitsField.type = "text";
                traitsField.className = "traitsField";
                traitsField.value = text[1];
                if ((traitsField.value.length > 0 || traitsField.value.length < 13) && text[2] != undefined) {
                    for (var b = 0; b < originTraits.length; b++){
                        if (text[2].toLowerCase() == originTraits[b]){
                            traitsField.value = text[1] + ' ' + text[2];
                        }
                    }
                } else {
                    traitsField.value = text[1];
                    traitsField.value = traitsField.value.toLowerCase();
                }
                if (traitsField.value.includes(' and ')){
                    traitsField.value = traitsField.value.replace('and ', ' ');
                } else if (traitsField.value.includes(' n ')) {
                    traitsField.value = traitsField.value.replace(' n ', ' ');
                }
                var nameField = document.createElement("INPUT");
                nameField.type = "text";
                nameField.className = "nameField";
                nameField.value = text[0];
                var selected = document.createElement("INPUT");
                selected.type = "checkbox";
                selected.className = "check";
                if (traitsField.value != "undefined" && nameField.value != ""){
                    for (var t = 0; t < originTraits.length; t++){
                        var traitSplit = traitsField.value.split(' ');
                        if (traitSplit[0].toLowerCase() == originTraits[t]){
                            selected.checked = true;
                        }
                    }
                }
                var teamChooser = document.createElement("SELECT");
                teamChooser.className = "team"

                var form = document.createElement("FORM");
                form.className = "msForm";

                form.appendChild(selected);
                form.appendChild(nameField);
                form.appendChild(traitsField);
                form.appendChild(genderM);
                form.appendChild(genderF);
                form.appendChild(genderN);
                form.appendChild(teamChooser);

                for (var x = 0; x < teamList.length; x++){
                    var member = document.createElement("OPTION");
                    member.value = teamList[x];
                    member.text = teamList[x];
                    teamChooser.appendChild(member);
                }

                traitsField.value = traitsField.value.toLowerCase();
                posts[i].prepend(form);
            }
        }
        active += 1;
    }

    // Removes the msForms on the posts.
    hide.type = "button";
    hide.value = "Hide";
    hide.onclick = function(){
        active = 0;
        for (var i = 0; i < posts.length; i++){
            var drawn = posts[i].getElementsByClassName("msForm");
            if (drawn[0]){
                drawn[0].remove();
            }
        }
    }

    settings.type = "button";
    settings.value = "Settings";

    /**
      * The generator loop.
      * The generator loop iterates through any post that has an
      * msForm, checks if it's selected, and then passes through all
      * the information to two arrays: one for the teams and one for
      * the entrants.
      * After these arrays are built, the information is formatted and
      * written into a textfield at the bottom, where the user can use
      * the copy button to retrieve the import statement and then paste
      * it into the import feature on orteil's site.
     */

    generate.type = "button";
    generate.value = "Generate";
    generate.onclick = function(){
        var forms = document.getElementsByClassName("msForm");
        var importState = document.createElement("TEXTAREA");
        importState.id = "importState";
        var teamListing = [];
        for (var n = 0; n < (teamList.length); n++){
            teamListing.push('{"name":"' + teamList[n] + '"}');
        }
        var teamEnd = '],"chars":[';
        var nameList = [];
        var errorList = [];
        var entries = [];
        var exceptions = 0;
        for (var i = 0; i < forms.length; i++){
            var name = forms[i].getElementsByClassName("nameField")[0];
            var traits = forms[i].getElementsByClassName("traitsField")[0].value;
            var gender = forms[i].getElementsByTagName("input");
            var team = forms[i].getElementsByTagName("option");
            var selection = forms[i].getElementsByClassName("check")[0];
            if (selection.checked) {
                nameList.push(name.value);
                var nameGen = name.value;
                var traitsGen = traits.split(' ');
                if (!(originTraits.has(traitsGen[0]) || originTraits.has(traitsGen[1]))){
                    traitsGen[0] = "none";
                    traitsGen[1] = "none";
                    errorList.push(nameGen);
                    exceptions++;
                }
                for (var x = 0; x < gender.length; x++) {
                    if (gender[x].type == 'radio' && gender[x].checked){
                        var genderGen = gender[x].value;
                    }
                }
                for (var z = 0; z < teamList.length; z++){
                    if (team[z].selected){
                        var teamGen = team[z].value;
                    }
                }

                var image = forms[i].parentNode;
                var imgHref = image.getElementsByClassName("fileThumb");
                if (imgHref[0]){
                    var picGen = imgHref[0].href;
                } else {
                    picGen = "defPic.jpg";
                }
                if (traitsGen[0] == "none") {
                    entries.push('{"name":"' + nameGen + '","g":' + genderGen +
                                 ',"t":0,"pic":"' + picGen + '","team":"' +
                                 teamGen + '","perks":[]}');
                } else if (traitsGen[1] == "none") {
                    entries.push('{"name":"' + nameGen + '","g":' + genderGen +
                                 ',"t":0,"pic":"' + picGen + '","team":"' +
                                 teamGen + '","perks":["' + traitsGen[0] +'"]}');
                } else {
                    entries.push('{"name":"' + nameGen + '","g":' + genderGen +
                                 ',"t":0,"pic":"' + picGen + '","team":"' +
                                 teamGen + '","perks":["' + traitsGen[0] + '","' +
                                 traitsGen[1] +'"]}');
                }
            }
            var entryEnd = (']}');
        }
        var fullInput = '{"teams":[' + teamListing + teamEnd + entries + entryEnd;
        var importIs = document.getElementById("importState");
        var importGrabber = document.getElementById("importGrab");
        if (importIs){
            importIs.remove();
            importGrabber.remove();
            importState.value = fullInput;
            document.body.appendChild(importState);
            document.body.appendChild(importGrab);
        } else {
            importState.value = fullInput;
            document.body.appendChild(importState);
            document.body.appendChild(importGrab);
        }
        if (exceptions > 0){
            var errors = errorList.join('\n');
            alert('ERRORS FOUND: ' + exceptions + '\nPlease check: ' + errors);
        }
    }

    document.body.appendChild(teams);
    document.body.appendChild(teamsList);
    document.body.appendChild(draw);
    document.body.appendChild(hide);
    document.body.appendChild(generate);
    document.body.appendChild(noneTraits);

}
