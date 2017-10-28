
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page isErrorPage="true"%>
<%@ page contentType="application/vnd.ms-excel;charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page language="java"
	import="java.sql.*,java.text.SimpleDateFormat,java.text.DateFormat,java.util.Date,java.util.List"%>
<%@page language="java" import="com.ge.vm.dto.HistoryReportDTO"%>
<%@page language="java" import="java.net.*"%>
<%@page language="java"
	import="org.apache.commons.lang.StringEscapeUtils.*"%>
<%
	String reportName = (String) request.getAttribute("reportName");
	response.setContentType("text/html;charset=UTF-8");
	response.setHeader("Content-Disposition", "attachment; filename=\""
			+ reportName + ".xls\"");
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%
	List<HistoryReportDTO> visitorCheckins = null;
	if (request.getAttribute("visitorCheckins") != null) {
		visitorCheckins = (List) request
				.getAttribute("visitorCheckins");
	}
%>
<html>
<form>
	<p align="center">
		<b><%=(String) request.getAttribute("reportHeading")%> </b>
	</p>
	<table border="1">
		<tr>
			<td><b>Visitor</b></td>
			<td><b>Company</b></td>
			<td><b>Mobile</b></td>
			<td><b>Email</b></td>
			<td><b>Host</b></td>
			<td><b>Scheduled Start Date</b></td>
			<td><b>Scheduled End Date</b></td>
			<td><b>Badge</b></td>
			<td><b>Check-In</b></td>
			<td><b>Checked-Out</b></td>
			<td><b>Escort Required</b></td>
			<td><b>Instructions</b></td>
			<td><b>Special Instruction</b></td>
		</tr>

		<%
			for (int i = 0; i < visitorCheckins.size(); i++) {
				HistoryReportDTO scheduleTransc = (HistoryReportDTO) visitorCheckins
						.get(i);
				String phone = scheduleTransc.getVisitorPhone();
				if (phone != null && !phone.isEmpty()) {
					phone = "\'" + phone;
				}
		%>
		<tr>
			<td><%=scheduleTransc.getVisitor()%></td>
			<td><%=scheduleTransc.getCompany()%></td>
			<td><%=phone%></td>
			<td><%=scheduleTransc.getEmail()%></td>
			<td><%=scheduleTransc.getHost()%></td>
			<td><%=scheduleTransc.getScheduledStartDate()%></td>
			<td><%=scheduleTransc.getScheduledEndDate()%></td>
			<td><%=scheduleTransc.getBadge()%></td>
			<td><%=scheduleTransc.getCheckIn()%></td>
			<td><%=scheduleTransc.getCheckedOut()%></td>
			<td><%=scheduleTransc.getEscortRequired()%></td>
			<td><%=scheduleTransc.getInstructions()%></td>
			<td><%=scheduleTransc.getSpecialInstruction()%></td>
		</tr>
		<%
			}
		%>
	</table>
</form>
</html>