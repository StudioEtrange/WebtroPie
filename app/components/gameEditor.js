/**
 * gameEditor.js
 *
 */
(function() {

    'use strict';

    angular
        .module('WebtroPie.game_editor', [])
        .directive('gameEditor', gameEditor);

    function gameEditor()
    {
        var directive = {
            templateUrl: 'components/gameEditor.html',
            scope: true,
            controller: GameEditorCtrl,
            controllerAs: 'vm',
            bindToController: { game:'=', selectedList:'=' }
        }
        return directive;
    }

    GameEditorCtrl.$inject = ['$scope','$element','$http','util','GameService','ThemeService'];

    function GameEditorCtrl($scope, $element, $http, util, GameService, ThemeService)
    {
        var vm = this

        // member functions
        vm.$onInit = onInit;
        vm.editorButtonKeyPress = editorButtonKeyPress;
        vm.editorKeyPress = editorKeyPress;
        vm.focusFirstButton = focusFirstButton;
        vm.gameImageStyle = gameImageStyle;
        vm.mdChanged = mdChanged;

        function onInit()
        {
            util.waitForRender($scope).then(focusFirstButton);
        }

        function editorButtonKeyPress($event)
        {
            if ($event.keyCode == 27)         // Escape
            {
                GameService.hideEditor();
            }
            else if ($event.keyCode == 37 )  // left arrow
            {
                $event.preventDefault();
                util.prevButton($event.srcElement);
            }
            else if ($event.keyCode == 39)    // right arrow
            {
                $event.preventDefault();
                util.nextButton($event.srcElement);
            }
        }

        function editorKeyPress($event)
        {
            if ($event.keyCode == 27)  // Escape
            {
                GameService.hideEditor();
            }
/*
            else if ($event.keyCode != 13 && // enter
                     $event.keyCode != 39 && // right arrow: system right
                     $event.keyCode != 37 && // left arrow: system left
                     $event.keyCode != 36 && // Home key: top of list
                     $event.keyCode != 35)    // End key: bottom of list
                util.keyPressCallback($event);
*/
        }

        function focusFirstButton()
        {
            var el = $element.find( "button" );
            if (el)
            for (var i = 0; i<el.length; i++)
            {
                if (el[i].className != 'ng-hide')
                {
                    el[i].focus();
                    break;
                }
            }
        }

        function gameImageStyle(path, filename)
        {
            if (filename)
            {
                return { 'background-image': GameService.getImageUrl(path, filename) }
            }
        }

        function mdChanged(field)
        {
            GameService.mdChanged(field, false, vm.game, GameService.editAll, vm.selectedList)
        }
    }

})();