import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Editorr from '@monaco-editor/react'
import { useParams } from 'react-router-dom'
import { api_base_url } from '../helper'
import { toast } from 'react-toastify'
const Editor = () => {
    const [code, setcode] = useState("rtwe")
    const [data, setdata] = useState("rtwe")
    const [output, setoutput] = useState("")
    const [error, seterror] = useState("")
    let { id } = useParams()

    useEffect(() => {
        fetch(api_base_url + "/getProject", {
            method: 'POST',
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectId: id,
                token: localStorage.getItem("token")
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setcode(data.project.code)
                    setdata(data.project)
                }
                else toast.error(data.message)
            })
            .catch(error => {
                console.error('Error:', error)
                toast.error(`Failed to lead ${error.message}`)
            })
    }, [id])
    const saveProject = () => {
        fetch(api_base_url + "/saveProject", {
            method: 'POST',
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectId: id,
                code: code,
                token: localStorage.getItem("token")
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    toast.success(data.msg)
                }
                else toast.error(data.message)
            })
            .catch(error => {
                console.error('Error:', error)
                toast.error(`Failed to lead ${error.message}`)
            })
    }
    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault(); // Prevent the default save dialog
                saveProject(); // Call the save function
            }
        };

        // Add event listener
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[code]); // Re-run effect if `code` changes


    const runProject = ()=>{
        const extn =
            data.name === "python" ? ".py" :
            data.name === "java" ? ".java" :
            data.name === "cpp" ? ".cpp" :
            data.name === "javascript" ? ".js" :
            data.name === "c" ? ".c" :
            data.name === "go" ? ".go" :
            data.name === "bash" ? ".sh" :
            "";
        fetch("https://emkc.org/api/v2/piston/execute",{
            method:"POST",
            mode:"cors",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                language:data.projectLanguage,
                version:data.version,
                files:[{
                    filename : data.name+ extn,
                    content:code,
                }]
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            setoutput(data.run.output)
            seterror(data.run.stderr)
        })
    }


    return (
        <>
            <Navbar />
            <div className="flex items-center justify-between" style={{ height: 'calc(100vh - 90px)' }}>
                <div className="left w-[50%] h-full">
                    <Editorr onChange={newCode => setcode(newCode)} theme='vs-dark' height="100%" width="100%" language="python" value={code} />
                </div>
                <div className="right p-[15px] w-[50%] h-full bg-[#27272a]">
                    <div className="flex pb-3 border-b-[1px] border-b-[#30303a] items-center justify-between px-[30px]">
                        <p className='p-0 m-0'>Output</p>
                        <button onClick={runProject} className="btnNormal !px-[40px] !w-fit bg-blue-500 transition-all hover:bg-blue-600">Run</button>

                    </div>
                    <pre className={`w-full h-[auto] bg-[#27272a]  ${error === "" ? "" : "text-red-500"} mx-[30px] mt-4`}>
                        {output}
                    </pre>
                </div>
            </div>
        </>
    )
}

export default Editor
