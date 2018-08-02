/* global angular */
(function() {
  console.clear();

  'use strict';

  var app = angular.module('formlyExample', ['formly', 'ngMessages', 'formlyBootstrap', 'ui.bootstrap', 'ngFileUpload'], function config(formlyConfigProvider) {
    var unique = 1;


    formlyConfigProvider.setWrapper([
      {
        template: [
          '<div class="formly-template-wrapper form-group"',
            'ng-class="{\'has-error\': options.validation.errorExistsAndShouldBeVisible}">',
            '<formly-transclude></formly-transclude>',
              '<div class="validation"',
              'ng-if="options.validation.errorExistsAndShouldBeVisible"',
              'ng-messages="options.formControl.$error">',
                '<div ng-messages-include="validation.html"></div>',
                '<div ng-message="{{::name}}" ng-repeat="(name, message) in ::options.validation.messages">',
                '{{message(options.formControl.$viewValue, options.formControl.$modelValue, this)}}',
                '</div>',
              '</div>',
          '</div>'
        ].join(' ')
      },
    ]);

    formlyConfigProvider.setType({
      name: 'repeatSection',
      templateUrl: 'repeatSection.html',
      controller: function($scope) {
        $scope.formOptions = {formState: $scope.formState};
        $scope.addNew = addNew;
        $scope.confirmRemove = confirmRemove;
        $scope.copyFields = copyFields;
        
        
        
        function copyFields(fields) {
          fields = angular.copy(fields);
          addRandomIds(fields);
          return fields;
        }

        function addNew() {
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          var repeatsection = $scope.model[$scope.options.key];
          var lastSection = repeatsection[repeatsection.length];
          var newsection = {};
          if (lastSection) {
            newsection = angular.copy(lastSection);
          }
          repeatsection.push(newsection);
        }
        
        function addRandomIds(fields) {
          unique++;
          angular.forEach(fields, function(field, index) {
            if (field.fieldGroup) {
              addRandomIds(field.fieldGroup);
              return; // fieldGroups don't need an ID
            }
            
            if (field.templateOptions && field.templateOptions.fields) {
              addRandomIds(field.templateOptions.fields);
            }
            
            field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
          });
        }
        
        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }

        function confirmRemove(index) {
          var reset = confirm("Are you sure you would like to remove this section?");
          if (reset == true){
            $scope.model[$scope.options.key].splice(index, 1);
          }
        }

      }
    });
  });

  app.run(function(formlyConfig, formlyValidationMessages) {
    formlyValidationMessages.messages.pattern = function(viewValue, modelValue, scope) {
      return viewValue + 'is invalid';
    };

    formlyConfig.setType({
      name: 'radioType',
      extends: 'radio',
      templateUrl: "inline-radio.html",
    });

    formlyConfig.setType({
       name: 'ng-file-upload',
       extends: 'input',
       templateUrl: 'ng-file.html'
    });

    var attributes = [
    'date-disabled',
    'custom-class',
    'show-weeks',
    'starting-day',
    'init-date',
    'min-mode',
    'max-mode',
    'format-day',
    'format-month',
    'format-year',
    'format-day-header',
    'format-day-title',
    'format-month-title',
    'year-range',
    'shortcut-propagation',
    'datepicker-popup',
    'show-button-bar',
    'current-text',
    'clear-text',
    'close-text',
    'close-on-date-selection',
    'datepicker-append-to-body'
    ];

    var bindings = [
      'datepicker-mode',
      'min-date',
      'max-date'
    ];

    var ngModelAttrs = {};

    angular.forEach(attributes, function(attr) {
      ngModelAttrs[camelize(attr)] = {attribute: attr};
    });

    angular.forEach(bindings, function(binding) {
      ngModelAttrs[camelize(binding)] = {bound: binding};
    });

    console.log(ngModelAttrs);
    
    formlyConfig.setType({
      name: 'datepicker',
      templateUrl:  'datepicker.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      defaultOptions: {
        ngModelAttrs: ngModelAttrs,
        templateOptions: {
          datepickerOptions: {
            format: 'MM.dd.yyyy',
            initDate: new Date()
          }
        }
      },
      controller: ['$scope', function ($scope) {
        $scope.datepicker = {};

        $scope.datepicker.opened = false;

        $scope.datepicker.open = function ($event) {
          $scope.datepicker.opened = !$scope.datepicker.opened;
        };
      }]
    });

    function camelize(string) {
        string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
          return chr ? chr.toUpperCase() : '';
        });
        // Ensure 1st char is always lowercase
        return string.replace(/^([A-Z])/, function(match, chr) {
          return chr ? chr.toLowerCase() : '';
        });
      }
  });

  app.controller('MainCtrl', function MainCtrl(formlyVersion) {

    var vm = this;
    // funcation assignment
    vm.onSubmit = onSubmit;
    vm.confirmreset = confirmreset;

    // variable assignment
    vm.author = { // optionally fill in your info below :-)
      name: 'Gal Ben-Chanoch',
    };
    vm.Title = 'Project Sumary and Working Group List'; // add this
    vm.env = {
      angularVersion: angular.version.full,
      formlyVersion: formlyVersion
    };
    vm.options = {

    };

    init();

    vm.originalFields = angular.copy(vm.fields);

    function onSubmit() {
      // var data = JSON.stringify(vm.model);// this is your data that you want to pass to the server (could be json)
      // var http = new XMLHttpRequest();
      // var url = 'senddata.php';
      // http.open('POST', url, true);

      // //Send the proper header information along with the request
      // http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

      // http.onreadystatechange = function() {//Call a function when the state changes.
      //     if(http.readyState == 4 && http.status == 200) {
      //         // alert(http.responseText);
      //     }
      // }
      // http.send(data);
      // console.log(data);

      alert("Thank you for submitting your attorney referral.");
      vm.options.resetModel();
    }

    function confirmreset() {
      var reset = confirm("Are you sure you would like to clear this form?");
      if (reset == true){
        vm.options.resetModel();
      }
    }



    function init() {

      vm.fields = 
      [
        {
          className: 'row',
          fieldGroup:[
            {
              className: 'col-xs-6',
              key: 'referring_first',
              type: 'input',
              templateOptions: {
                  type: 'text',
                  label: 'Referring Party\'s First Name',
                  placeholder: 'Enter your first name',
                  required: true,
              }
            },
            {
              className: 'col-xs-6',
              key: 'referring_last',
              type: 'input',
              templateOptions: {
                  type: 'text',
                  label: 'Referring Party\'s Last Name',
                  placeholder: 'Enter your last name',
                  required: true,
              }
            },
          ]
        },
        {
          className: 'row',
          fieldGroup:[
            {
              className: 'col-xs-6',
              key: 'recommended_first',
              type: 'input',
              templateOptions: {
                  type: 'text',
                  label: 'Recommended Party\'s First Name',
                  placeholder: 'Enter the recommended party\'s first name',
                  required: true,
              }
            },
            {
              className: 'col-xs-6',
              key: 'recommended_last',
              type: 'input',
              templateOptions: {
                  type: 'text',
                  label: 'Recommended Party\'s Last Name',
                  placeholder: 'Enter the recommended party\'s last name.',
                  required: true,
              }
            },
          ]
        },
        {
          type: 'textarea',
          templateOptions: {
            label: 'Recommendation Notes',
            placeholder: 'Please enter any notes about why you would like to recommend this attorney.',
            description: ''
          },
        },
      ];
    }
  });

})();

