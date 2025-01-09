import { useEffect, useState } from 'react'
import Select from 'react-select';
import { api_base_url } from '../helper';
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const Home = () => {


  const [isCreateModelShow, setisCreateModelShow] = useState(false)
  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isEditModelShow, setisEditModelShow] = useState(false)
const [pid, setpid] = useState("")  
const [updname, setupdname] = useState("")  
  const navigate = useNavigate()

  const [name, setname] = useState("")
  const customStyles = {
    control: (provided) => ({
      ...provided,
      margin: '12px 0 0 0',
      backgroundColor: '#000',
      border: '1px solid #0F0E0E', // Custom border color
      borderRadius: '16px', // Rounded corners
      padding: '5px', // Add some padding
      boxShadow: 'none', // Remove box shadow
      '&:hover': {
        border: '1px solid BLUE', // Border color on hover
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#0f0e0e',
      borderRadius: '8px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#333' : '#0f0e0e',
      color: state.isFocused ? '#fff' : '#ccc',
      padding: '10px',
      '&:hover': {
        backgroundColor: '#444',
        color: '#fff',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#444',
    }),
  };

  const getRunTimes = async () => {
    let res = await fetch("https://emkc.org/api/v2/piston/runtimes");
    let data = await res.json();

    // Filter only the required languages
    const filteredLanguages = [
      "python",
      "javascript",
      "c",
      "c++",
      "java",
      "bash"
    ];

    const options = data
      .filter(runtime => filteredLanguages.includes(runtime.language))
      .map(runtime => ({
        label: `${runtime.language} (${runtime.version})`,
        value: runtime.language === "c++" ? "cpp" : runtime.language,
        version: runtime.version,
      }));

    setLanguageOptions(options);
  };

  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption); // Update selected language state
    console.log("Selected language:", selectedOption);
  };

  const [projects, setprojects] = useState(null)

  const getProjects = async () => {
    fetch(api_base_url + "/getProjects", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token")
      })

    })
      .then(response => response.json())
      .then(data => {
        if (data.success) setprojects(data.projects)
        else toast.error(data.msg)
      })
  }

  const createProj = () => {
    fetch(api_base_url + '/createProject', {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "name": name,
        projectLanguage: selectedLanguage.value,
        token: localStorage.getItem("token"),
        version:selectedLanguage.version

      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          navigate('/editor/' + data.project._id)
        }
        else {
          toast.error(data.msg)
        }
      })
  }

  const deleteProject = (id) => {
    let cnf = confirm("Are you sure you want to delete this project?")
    if (cnf)
      fetch(api_base_url + '/deleteProject', {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "projectId": id,
          token: localStorage.getItem("token")

        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            getProjects()
          }
          else {
            toast.error(data.msg)
          }
        })
  }
  const updateProject = () => {
    
      fetch(api_base_url + '/updateProject', {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "projectId": pid,
          name:updname,
          token: localStorage.getItem("token")

        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setpid("")
            setupdname("")
            setisEditModelShow(false)
            getProjects()
          }
          else {
            toast.error(data.msg)
          }
        })
  }




  useEffect(() => {
    getProjects();
    getRunTimes();
  }, []);
  return (
    <>
      <Navbar />
      <div className='flex px-[100px] items-center justify-between  mt-5'>
        <h3 className='text-2xl'>Hi, ✋, Suyash </h3>
        <div className="flex items-center">
          <button className="btnNormal bg-blue-500 transition-all hover:bg-blue-600" onClick={() => { setisCreateModelShow(true) }}>Create Project</button>
        </div>
      </div>

      <div className="projects px-[100px] mt-5 pb-6">
        {
          projects && projects.length > 0 ? projects.map((project, index) => {
            return <>
              <div className="project w-full p-[15px] flex items-center  justify-between bg-[#0f0e0e]">
                <div onClick={() => { navigate("/editor/" + project._id) }} className="flex w-full items-center gap-[15px]">
                  {
                    project.projectLanguage === "python" ?
                      <>
                        <img className='w-[100px] rounded-md h-[110px] object-cover' src="https://images.ctfassets.net/em6l9zw4tzag/oVfiswjNH7DuCb7qGEBPK/b391db3a1d0d3290b96ce7f6aacb32b0/python.png" alt="" />
                      </>
                      : project.projectLanguage === "javascript" ?
                        <>
                          <img className='w-[100px] rounded-md h-[110px] object-cover' src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" alt="" />
                        </> : project.projectLanguage === "cpp" ?
                          <>
                            <img className='w-[100px] rounded-md h-[110px] object-cover' src="https://upload.wikimedia.org/wikipedia/commons/3/32/C%2B%2B_logo.png" alt="" />
                          </> : project.projectLanguage === "c" ?
                            <>
                              <img className='w-[100px] rounded-md h-[110px] object-cover' src="https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png" alt="" />
                            </> : project.projectLanguage === "java" ?
                              <>
                                <img className='w-[100px] rounded-md h-[110px] object-cover' src="https://static-00.iconduck.com/assets.00/java-icon-1511x2048-6ikx8301.png" alt="" />
                              </> : project.projectLanguage === "bash" ?
                                <>
                                  <img className='w-[100px] rounded-md h-[110px] object-cover' src="https://w7.pngwing.com/pngs/48/567/png-transparent-bash-shell-script-command-line-interface-z-shell-shell-rectangle-logo-commandline-interface-thumbnail.png" alt="" />
                                </> : ""
                  }
                  <div>
                    <h3 className='text-xl'>{project.name}</h3>
                    <p className='text[14px] text-[grey]'>{new Date(project.date).toString()}</p>
                  </div>
                </div>

                <div className='flex items-center gap-[15px]'>

                  <button onClick={() => {
                    setisEditModelShow(true)
                    setpid(project._id)
                    setupdname(project.name)
                  }} className="btnNormal bg-blue-500 transition-all hover:bg-blue-600">Edit</button>
                  <button onClick={() => { deleteProject(project._id) }} className="btnNormal bg-red-500 transition-all hover:bg-red-600">Delete</button>
                </div>

              </div>
            </>

          }) : "No projects to show!"
        }


      </div>

      {
        isCreateModelShow &&
        <div onClick={(e) => {
          if (e.target.classList.contains("modelCon")) {
            setisCreateModelShow(false);
            setname("");
          }
        }} className='modelContainer flex flex-col items-center justify-center w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)]'>
          <div className="modelBox flex flex-col rounded-xl p-[20px] w-[25vw] h-[auto] bg-[#0f0e0e]">
            <h3 className='text-xl text-center font-bold'>Create Project</h3>
            <div onChange={(e) => { setname(e.target.value) }} value={name} className="inputBox">
              <input type="text" placeholder="Project Name" className="inputField" />
            </div>
            <Select
              placeholder="Select a Language"
              options={languageOptions}
              styles={customStyles}
              onChange={handleLanguageChange} // Handle language selection
            />
            {selectedLanguage && (
              <>
                <p className="text-[14px] text-green-500 mt-2">
                  Selected Language: {selectedLanguage.label}
                </p>
                <button onClick={createProj} className="btnNormal bg-blue-500 transition-all hover:bg-blue-600 mt-2">Create</button>
              </>
            )}
          </div>
        </div>

      }

      {
        isEditModelShow &&
        <div className='modelContainer flex flex-col items-center justify-center w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)]'>
          <div className="modelBox flex flex-col rounded-xl p-[20px] w-[25vw] h-[auto] bg-[#0f0e0e]">
            <h3 className='text-xl text-center font-bold'>Update Project</h3>
            <div className="inputBox">
              <input onChange={(e)=>{setupdname(e.target.value)}} value={updname} type="text" placeholder="Previous Name" className="inputField" />
            </div>
                <button onClick={updateProject} className="btnNormal bg-blue-500 transition-all hover:bg-blue-600 mt-2">Update Name</button>
          </div>
        </div>

      }
    </>
  )
}

export default Home
