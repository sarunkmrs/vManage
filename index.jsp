<%@ page isErrorPage="true"%>
<%@ page contentType="text/html;charset=ISO-8859-1"
	pageEncoding="UTF-8"%>
<%@page language="java"
	import="com.ge.vm.service.ScheduleVisitorResource"%>
<%
	ScheduleVisitorResource resource = new ScheduleVisitorResource();
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="GE vManage" />
<meta name="keywords" content="GE, vManage" />
<meta name="author" content="GE" />
<title>vManage</title>

<!-- Favicon -->
<link rel="apple-touch-icon" href="images/touch-icon-iphone.png" />
<link rel="apple-touch-icon" sizes="76x76" href="images/touch-icon-ipad.png" />
<link rel="apple-touch-icon" sizes="120x120" href="images/touch-icon-iphone-retina.png" />
<link rel="apple-touch-icon" sizes="152x152" href="images/touch-icon-ipad-retina.png" />
<link rel="shortcut icon" href="images/favicon.ico" />

<link href="build/style.min.css" rel="stylesheet" />
<!--
	HTML5 Shim and Respond.js and Respond.js proxy script on local server
	IE8 support of HTML5 elements and media queries
-->
<!--[if lt IE 9]>
<script src="js/html5shiv.js"></script>
<script src="js/respond.min.js"></script>
<script>
    document.createElement('ui-select');
    document.createElement('ui-select-match');
    document.createElement('ui-select-choices');
</script>
<![endif]-->

</head>

<body class="fade-in" ng-app="vmApp" ng-controller="AppController" ng-cloak>
<toast></toast>
<div id="wrapper">
	
    <nav class="navbar navbar-default navbar-static-top" role="navigation">
    	
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".sidebar-collapse">
            	<span class="sr-only">Toggle navigation</span> 
                <span class="icon-bar"></span> 
                <span class="icon-bar"></span> 
                <span class="icon-bar"></span> 
            </button>
            <a class="navbar-brand" href="#/dashboard">
            	<img class="brand-logo" src="images/logo.png" alt="">
            </a>
        </div>
        <!-- /.navbar-header -->
        
        <ul class="nav navbar-top-links navbar-right">
        	<!--<li class="hidden-xs">
                <a href="#" ng-class="{'active': inFullScreen}" ng-click="toggleFullScreen();">
                    <i class="fa fa-expand fa-fw" ng-hide="inFullScreen"></i>
                    <i class="fa fa-compress fa-fw" ng-show="inFullScreen"></i>
                </a>
            </li>-->
            <!-- /.dropdown -->
            <li class="dropdown">
            	<a class="dropdown-toggle text-center" data-toggle="dropdown" href="javascript:void(0);">
                	<i class="fa fa-globe  fa-2x fa-fw"></i> {{langCode}}
                    <span class="caret"></span>
                </a>
                <ul class="dropdown-menu dropdown-language">
                    <li ng-repeat="language in languages">
                		<a href="javascript:void(0);" ng-click="changeLanguage(language.code);">
                        	<i class="fa fa-flag-o fa-fw"></i> 
                        	{{language.name}}
                        </a>
                	</li>
                </ul>
            </li>
            <li class="dropdown">
            	<a class="dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);">
                    <span ng-hide="showAvatar">
                    	<i class="fa fa-user fa-2x fa-fw"></i>
                    	{{translation.GLOBAL.WELCOME}} {{user.name}}
                    </span>
                    <span class="avatar main" ng-show="showAvatar">
                    	<img ng-src="http://supportcentral.gecdn.com/images/person/temp/{{user.sso}}.jpg" />
                    </span>
                    <span class="caret"></span>
                </a>
                <ul class="dropdown-menu dropdown-user">
                    <li ng-show="showAvatar">
                    	<a href="javascript:void(0);" class="user">
                        	<i class="fa fa-user fa-fw"></i> 
                            {{user.name}}
                        </a>
                    </li>
                    <li class="divider" ng-show="showAvatar"></li>
                    <li>
                    	<a href="javascript:void(0);" ng-click="logout()">
                        	<i class="fa fa-sign-out fa-fw"></i>
                            {{translation.GLOBAL.LOGOUT}}
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
        <!-- /.navbar-top-links --> 
        
    </nav>
    <!-- /.navbar-static-top -->
    
    <nav class="navbar-default navbar-static-side" role="navigation">
        <div class="sidebar-collapse">
            <ul class="nav" id="side-menu" ng-show="locations.length && access">
                <li ng-show="showMenu('dashboard')">
                	<a href="#/dashboard" ng-class="{active: isActiveMenu('/dashboard')}">
                    	<i class="fa fa-home fa-fw fa-3x"></i>
                    	{{translation.MENU.RECEPTION}}
                    </a>
                </li>
                <li ng-show="showMenu('myvisitors')">
                	<a href="#/myvisitors" ng-class="{active: isActiveMenu('/myvisitors')}">
                    	<i class="fa fa-users fa-fw fa-3x"></i> 
                        {{translation.MENU.MY_VISITOR}}
                    </a>
                </li>
                <li ng-show="showMenu('schedule')">
                	<a href="#/schedule" ng-class="{active: isActiveMenu('/schedule')}">
                    	<i class="fa fa-calendar fa-fw fa-3x"></i> 
                        {{translation.MENU.SCHEDULE}}
                    </a>
                </li>
                <li ng-show="showMenu('bulkschedule')">
                	<a href="#/bulkschedule" ng-class="{active: isActiveMenu('/bulkschedule')}">
                        <i class="fa fa-cloud-upload fa-fw fa-3x"></i> 
                        {{translation.MENU.BULK_UPLOAD}}
                    </a>
                </li>
                <li ng-show="showMenu('reports')" ng-class="{active: isActiveMenu('/reports')}">
                	<a href="#/reports" ng-class="{active: isActiveMenu('/reports')}">
                    	<i class="fa fa-bar-chart-o fa-fw fa-3x"></i> 
                        {{translation.MENU.REPORTS}}
                    </a>
                </li>
                <!--<li ng-show="showMenu('settings')" ng-class="{active: isActiveMenu('settings')}">
                	<a href="#/settings" ng-class="{active: isActiveMenu('settings')}">
                    	<i class="fa fa-cogs fa-fw fa-3x"></i> 
                        {{translation.MENU.SETTINGS}}
                    </a>
                </li>-->
                <li ng-show="showMenu('admin')" ng-class="{active: isActiveMenu('admin')}">
                	<a href="#/admin" ng-class="{active: isActiveMenu('admin')}">
                    	<i class="fa fa-cogs fa-fw fa-3x"></i> 
                        {{translation.MENU.ADMIN}}
                    </a>
                </li>
                <li ng-show="showMenu('bannedvisitors')" ng-class="{active: isActiveMenu('bannedvisitors')}">
                	<a href="#/bannedvisitors" ng-class="{active: isActiveMenu('bannedvisitors')}">
                    	<i class="fa fa-user-times fa-fw fa-3x"></i> 
                        {{translation.MENU.BANNED_VISITORS}}
                    </a>
                </li>
                <li ng-show="showMenu('bannedschedules')" ng-class="{active: isActiveMenu('bannedschedules')}">
                	<a href="#/bannedschedules" ng-class="{active: isActiveMenu('bannedschedules')}">
                    	<i class="fa fa-ticket fa-fw fa-3x"></i> 
                        {{translation.MENU.BANNED_SCHEDULES}}
                    </a>
                </li>
            </ul>
            <!-- /#side-menu --> 
        </div>
        <!-- /.sidebar-collapse --> 
    </nav>
    <!-- /.navbar-static-side -->
    
    <div id="page-wrapper">
		
        <div growl></div>
        
        <!-- Placeholder for views -->
   		<div ng-view="" class="slide-reveal"></div>
        
    </div>
    <!-- /#page-wrapper --> 
    
    <footer class="custom-footer">
    	{{translation.GLOBAL.BROWSERS}}
        <span class="pull-right">Copyright &copy; {{config.today | date:'yyyy'}} General Electric Company</span>
    </footer>
    
</div>
<!-- /#wrapper --> 

<!-- Print template will render here -->
<div ng-include data-src="printFile"></div>

<script src="build/core.min.js"></script>
<script>
	
	var APP = {};
	
	APP.CONFIG = <%=resource.vmUserPrefs(request)%>;
	
</script>
<script src="build/app.min.js"></script>
<script src="build/lang.min.js" charset="utf-8"></script>
<script>
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	
	ga('create', 'UA-41068547-24', 'ge.com');
</script>
</body>
</html>