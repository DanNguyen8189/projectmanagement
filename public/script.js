var myApp = angular.module("myApp", ["ngRoute"]);

  myApp.config(function($routeProvider){
    $routeProvider

      .when("/", {
        templateUrl: "views/home.html",
        controller: "homeController"
      })

      .when("/project/:clientCode", {
        templateUrl: "views/projectClientView.html",
        controller: "projectClientViewController"
      })

      .when("/admin", {
        templateUrl: "views/projectAdminView.html",
        controller: "projectAdminViewController"
      })

      .when("/admin/milestones/:projectId", {
        templateUrl: "views/milestones.html",
        controller: "milestonesViewController"
      })

  });

myApp.controller("mainController", function($scope, $http) {
  /*$scope.login = function(clientCode) {
    alert(clientCode);
    console.log(clientCode);
  };*/
  $scope.test = function(){
    alert("test function in main controller");
  }
});

//home controller (the page where client enters their project)
myApp.controller("homeController", function($scope, $http) {
  $scope.login = function(clientCode) {
    let filter = { clientcode: clientCode };
    filter_string = "?filter=" + JSON.stringify(filter);
    $http
      .get("/api/project/" + filter_string).then(function(response) {
        if (response.data.length > 0){
          window.location = "#!/project/" + clientCode;
        }
        else{
          alert("That client code doesn't exist!");
        }
      }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
        console.log(response);
        alert("error: " + response);
    });
  };
});

//controller for the client's view of their project
myApp.controller("projectClientViewController", function($scope, $routeParams, $http) {
  $scope.clientCode = $routeParams.clientCode;
  $scope.getProjectInfo = function(clientCode){
    let filter = { clientcode: clientCode };
    filter_string = "?filter=" + JSON.stringify(filter);
    $http
      .get("/api/project/" + filter_string).then(function(response) {

        //hold all of the project data here!
        let data = response.data[0]
        $scope.projectId = data._id;
        $scope.status = data.status;
        $scope.name = data.name;
        $scope.details = data.details;
        $scope.clientname = data.clientname;
        $scope.contact = data.contact;
        $scope.estimatedcost = data.estimatedcost;
        $scope.milestones = data.milestones;

      }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
      console.log(response);
      alert("error: " + response);
    });
  };

  //initialize the project page here! Don't think I could have used the init function because I pass in the client code
  $scope.getProjectInfo($scope.clientCode);

  $scope.viewMilestone = function(milestone){
    $scope.viewMilestoneView = true;
    $scope.milestoneId = milestone._id;
    $scope.milestoneName = milestone.name;
    $scope.milestoneDescription = milestone.description;
    $scope.milestoneStatus = milestone.status;
  }

  $scope.closeMilestone = function(){
    $scope.viewMilestoneView = false;
    $scope.milestoneId = ""
    $scope.milestoneName = "";
    $scope.milestoneDescription = "";
    $scope.milestoneStatus = "";
  }

  //client hits button to approve milestone
  $scope.approveMilestone = function(){
    let milestoneData = { 
      _id: $scope.milestoneId,
      name: $scope.milestoneName,
      description: $scope.milestoneDescription,
      status: "approved" 
    }   
    //alert(JSON.stringify(milestoneData));
    $http
      .put("/api/project/updatemilestone/" + $scope.projectId, milestoneData).then(function(response) {
        $scope.closeMilestone();
        $scope.getProjectInfo($scope.clientCode);
      }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
      alert("Error when approving milestone: " + JSON.stringify(response.data));
    });
  } 
});

//controller for the admin view of all projects
myApp.controller("projectAdminViewController", function($scope, $routeParams, $http) {
  $scope.addProjectVisible = false;
  $scope.editProjectVisible = false;
  $scope.projects = [];

  //open the form for the user - it'll be either the add project form or the edit project form based on the type parameter
  $scope.openForm = function(type, clientCode){
    if (type == 'add'){
      $scope.projectNameInput = "";
      $scope.projectDetailsInput = "";
      $scope.clientNameInput = "";
      $scope.emailInput = "";
      $scope.estimatedCostInput = "";
      $scope.statusInput = "";
      $scope.clientCodeInput = "";
      $scope.editProjectVisible = false;
      $scope.addProjectVisible = true;
    }
    else {
      //get the project we want to edit and fill out the fields with its existing information
      let filter = { clientcode: clientCode };
      filter_string = "?filter=" + JSON.stringify(filter);
      $http
        .get("/api/project/" + filter_string).then(function(response) {
          let data = response.data[0];
          $scope.project_id = data._id;
          $scope.projectNameInput = data.name;
          $scope.projectDetailsInput = data.details;
          $scope.clientNameInput = data.clientname;
          $scope.emailInput = data.contact;
          $scope.estimatedCostInput = data.estimatedcost;
          $scope.statusInput = data.status;
          $scope.clientCodeInput = data.clientcode;
          $scope.addProjectVisible = false;
          $scope.editProjectVisible = true;
        }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
        console.log(response);
        alert("error: " + response);
      });
    }
  }

  //clear input and close the form when user hits cancel or the x button
  $scope.closeForm = function(){
    $scope.projectNameInput = "";
    $scope.projectDetailsInput = "";
    $scope.clientNameInput = "";
    $scope.emailInput = "";
    $scope.estimatedCostInput = "";
    $scope.statusInput = "";
    $scope.clientCodeInput = "";
    $scope.addProjectVisible = false;
    $scope.editProjectVisible = false;
  }

  $scope.getProjects = function(){
    //alert("inside getProjects()");
    $http
      .get("/api/project/").then(function(response)   {
        $scope.projects = response.data;
        //alert(JSON.stringify($scope.projects));
      }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
      console.log(response.data);
      alert("error: " + JSON.stringify(response));
    });
  };

  //user confirms adding project
  $scope.addProject = function(){
    $scope.projectFormError = "";
    if ($scope.statusInput == ""){
      $scope.statusInput = "in progress";
    }
    let projectData = {
      name: $scope.projectNameInput,
      details: $scope.projectDetailsInput,
      clientname: $scope.clientNameInput,
      contact: $scope.emailInput,
      estimatedcost: $scope.estimatedCostInput,
      status: $scope.statusInput,
      clientcode: $scope.clientCodeInput
    };
    //alert(JSON.stringify(projectData));

    $http
      .post("/api/project/add", projectData).then(function(response) {
        //update project list and confirm success
        $scope.closeForm();
        $scope.getProjects();
      }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
      $scope.projectFormError = JSON.stringify(response.data);
      alert("Error when adding project: " + JSON.stringify(response.data));
    });
  };

  //user confirms editting project
  $scope.editProject = function(){
    $scope.projectFormError = "";
    let projectData = {
      name: $scope.projectNameInput,
      details: $scope.projectDetailsInput,
      clientname: $scope.clientNameInput,
      contact: $scope.emailInput,
      estimatedcost: $scope.estimatedCostInput,
      status: $scope.statusInput,
      clientcode: $scope.clientCodeInput
    };
    $http
      .put("/api/project/" + $scope.project_id, projectData).then(function(response) {
        //update project list and confirm success
        $scope.closeForm();
        $scope.getProjects();
        //alert("edit project result: " + JSON.stringify(response.data));
      }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
      $scope.projectFormError = JSON.stringify(response.data);
      alert("Error when editting project: " + JSON.stringify(response.data));
    });
  };

  $scope.deleteProject = function(clientCode){
    //alert("delete btn" + clientCode);
    let filter = { clientcode: clientCode };
    filter_string = "?filter=" + JSON.stringify(filter);
    $http
      .delete("/api/project/" + filter_string).then(function(response) {
        //update project list and confirm success
        //alert(JSON.stringify(response.data));
        $scope.getProjects();
      }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
      $scope.addProjectError = JSON.stringify(response.data);
      alert("Error when deleting project: " + JSON.stringify(response.data));
    });
  };

  $scope.openMilestones = function(projectId){
    window.location = "#!/admin/milestones/" + projectId;
  }

  $scope.getProjects();
});

//controller for admin view of project milestones
myApp.controller("milestonesViewController", function($scope, $routeParams, $http) {
  let data = {}
  let milestones = []
  $scope.getProjectMilestones = function(){
    //alert("lit " + $routeParams.projectId);
    $http
      .get("/api/project/" + $routeParams.projectId).then(function(response) {
        //alert("http return" + JSON.stringify(response));
        data = response.data;
        $scope.projectName = data.name;
        $scope.projectDetails = data.details;
        $scope.clientName = data.clientname;
        $scope.email = data.contact;
        $scope.estimatedCost = data.estimatedcost;
        $scope.status = data.status;
        $scope.clientCode = data.clientcode;
        $scope.milestones = data.milestones;
      }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
        console.log(response);
        alert("error: " + response);
      });
  }

  //opens the milestone form, whether it's add or edit depends on the type parameter
  $scope.openForm = function(type, milestone){
    if(type == "add"){
      $scope.addMilestoneView = true;
      $scope.editMilestoneView = false;
    }
    else {
      //open the form ans set the fields according to the current milestone
      $scope.addMilestoneView = false;
      $scope.editMilestoneView = true;
      $scope._id = milestone._id;
      $scope.nameInput = milestone.name;
      $scope.statusInput = milestone.status;
      $scope.descriptionInput = milestone.description;
    }
  }

  //user hits cancel/close, reset all the fields
  $scope.closeForm = function(){
    $scope.addMilestoneView = false;
    $scope.editMilestoneView = false;
    $scope.nameInput = "";
    $scope.descriptionInput = "";
  }

  //user hits the done/submit button
  $scope.addMilestone = function(){
    let milestoneData = { 
      name: $scope.nameInput,
      description: $scope.descriptionInput,
      status: "pending approval" 
    }
    $http
      .put("/api/project/addmilestone/" + $routeParams.projectId, milestoneData).then(function(response) {
        $scope.closeForm();
        $scope.getProjectMilestones();
      }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
      alert("Error when adding milestone: " + JSON.stringify(response.data));
    });
  }

  //user hits the done/submit button
  $scope.editMilestone = function(){
    let milestoneData = { 
      _id: $scope._id,
      name: $scope.nameInput,
      description: $scope.descriptionInput,
      status: "pending approval" 
    }   
    //alert(JSON.stringify(milestoneData));
    $http
      .put("/api/project/updatemilestone/" + $routeParams.projectId, milestoneData).then(function(response) {
        $scope.closeForm();
        $scope.getProjectMilestones();
      }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
      alert("Error when editting milestone: " + JSON.stringify(response.data));
    });
  }

  //user deletes milestone
  $scope.removeMilestone = function(id){
    let milestoneData = { 
      _id: id
    }
    $http
      .put("/api/project/removemilestone/" + $routeParams.projectId, milestoneData).then(function(response) {
        $scope.getProjectMilestones();
      }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
      alert("Error when removing milestone: " + JSON.stringify(response.data));
    });    
  }
});