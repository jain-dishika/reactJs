import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getProjectData } from "../Slices/ProjectSlices";
import { getTeamMemberDataByProjectId } from "../Slices/TeamMemberSlice";

const AddTicket = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projectList);
  const { teamMembers } = useSelector((state) => state.teaMemberList);

  useEffect(() => {
    dispatch(getProjectData());
  }, []);

  const [name, setName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState([]); // Store selected assignees
  const [status, setStatus] = useState("TO DO");
  const [priority, setPriority] = useState("Medium");
  const [project, setProject] = useState("");
  const [nameError, setNameError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [assigneeError, setAssigneeError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [priorityError, setPriorityError] = useState("");
  const [projectError, setProjectError] = useState("");
  const [filteredAssignees, setFilteredAssignees] = useState([]); // Define filteredAssignees state

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      addTicket(name, endDate, selectedAssignees, status, priority, project);
    }
  };

  const validateForm = () => {
    let isValid = true;
    setNameError("");
    setEndDateError("");
    setAssigneeError("");
    setStatusError("");
    setPriorityError("");
    setProjectError("");

    if (!name) {
      setNameError("Name is required");
      isValid = false;
    }

    if (!endDate) {
      setEndDateError("End Date is required");
      isValid = false;
    }

    if (selectedAssignees.length === 0) {
      setAssigneeError("At least one Assignee is required");
      isValid = false;
    }

    if (!status) {
      setStatusError("Status is required");
      isValid = false;
    }

    if (!priority) {
      setPriorityError("Priority is required");
      isValid = false;
    }

    if (!project) {
      setProjectError("Project is required");
      isValid = false;
    }

    return isValid;
  };

  const notify = (msg) => toast(msg);

  const addTicket = (name, endDate, selectedAssignees, status, priority, project) => {
    //navigate("/admin/tickets");

    let ticket = {
      name,
      endDate,
      assigneeUsers: selectedAssignees.map((assigneeId) => ({ id: assigneeId })),
      status,
      priority,
      project,
    };

    console.log("ticket ", ticket);
  };

  const handleProjectChange = (selectedProject) => {
    // Filter assignees based on the selected project
    const projectData = projects.find((proj) => proj.id === selectedProject);
    if (projectData) {
      setSelectedAssignees([]);
      setFilteredAssignees(projectData.assignees);
    } else {
      setSelectedAssignees([]);
      setFilteredAssignees([]);
    }
  };

  return (
    <div className="formParent">
      <Container
        className="formParent-container"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Form className="ticket-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label className="text-center">Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Form.Text className="text-danger">{nameError}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEndDate">
            <Form.Label className="text-center">End Date</Form.Label>
            <Form.Control
              required
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Form.Text className="text-danger">{endDateError}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicProject">
            <Form.Label className="text-center">Project</Form.Label>
            <Form.Control
              required
              as="select"
              value={project}
              onChange={(e) => {
                const selectedProject = e.target.value;
                setProject(selectedProject);
                handleProjectChange(selectedProject);
                dispatch(getTeamMemberDataByProjectId(selectedProject));
              }}
            >
              <option value="">Select a Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </Form.Control>
            <Form.Text className="text-danger">{projectError}</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicAssignees">
            <Form.Label className="text-center">Assignee</Form.Label>
            <Form.Control
              required
              as="select"
              // value={project}
              onChange={(e) => {
                const selectedProject = e.target.value;
                setProject(selectedProject);
                handleProjectChange(selectedProject);
                dispatch(getTeamMemberDataByProjectId(selectedProject));
              }}
            >
              <option value="">Select Assignees</option>
              <option>Helloo</option>
              <option>Helloo</option>
              <option>Helloo</option>
              <option>Helloo</option>
              <option>Helloo</option>
              {/* {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))} */}
            </Form.Control>
            <Form.Text className="text-danger">{projectError}</Form.Text>
          </Form.Group>
          
                
          {/* <Form.Group className="mb-3" controlId="formBasicAssignees">
            <Form.Label className="text-center">Assignees</Form.Label>
            <Form.Control
              required
              as="select"
              multiple
              value={selectedAssignees}
              onChange={(e) =>
                setSelectedAssignees(Array.from(e.target.selectedOptions, (option) => option.value))
              }
            >
              <option>Hello</option>
              <option>Hello</option>
              <option>Hello</option> */}
              {/* {filteredAssignees.map((assignee) => (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </option>
              ))} */}
            {/* </Form.Control>
            <Form.Text className="text-danger">{assigneeError}</Form.Text>
          </Form.Group> */}

          <Form.Group className="mb-3" controlId="formBasicStatus">
            <Form.Label className="text-center">Status</Form.Label>
            <Form.Control
              required
              as="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="TO DO">TO DO</option>
              <option value="IN PROGRESS">IN PROGRESS</option>
              <option value="DONE">DONE</option>
              <option value="ON HOLD">ON HOLD</option>
            </Form.Control>
            <Form.Text className="text-danger">{statusError}</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPriority">
            <Form.Label className="text-center">Priority</Form.Label>
            <Form.Control
              required
              as="select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="High">High</option>
            </Form.Control>
            <Form.Text className="text-danger">{priorityError}</Form.Text>
          </Form.Group>

          <Button variant="danger" type="submit" style={{ margin: "20px" }}>
            ADD TICKET
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default AddTicket;
