angular
  .module('app', [])
  .controller('MainController', ['$scope', '$interval', 'Icecast', MainController])
  .factory('Icecast', ['$http', '$q', Icecast]);

function MainController($scope, $interval, Icecast) {
  $scope.state = '休止中';
  $scope.offlineState = true;
  $scope.liveState = false;
  $scope.listenerCount = 0;
  var t = $interval(function() {
    Icecast.getResource().then(function(data) {
      if (data.icestats !== undefined && data.icestats.source !== undefined) {
        if ($scope.state === '休止中') {
          $scope.state = '放送中!';
          $scope.offlineState = false;
          $scope.liveState = true;
          $scope.listenerCount = data.icestats.source.listeners;
        } 
      } else {
        if ($scope.state === '放送中!') {
          $scope.state = '休止中';
          $scope.offlineState = true;
          $scope.liveState = false;
          $scope.listenerCount = 0;
        }
      }
    });
  }, 1000);
}

function Icecast($http, $q) {
  var self = {};

  self.getResource = function(){
    var d = $q.defer();
    return $http({
        method: 'GET',
        url: 'https://live.oguradio.com/status-json.xsl',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Origin': undefined
        }
      })
      .then(function(response) {
        d.resolve(response.data);
        return d.promise;
      }, function(response) {
        d.resolve(response);
        return d.promise;
      });
  };

  return self;
}