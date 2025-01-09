const userModel = require('../models/userModel')
const projectModel = require('../models/projectModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
exports.signup = async (req, res) => {
    try {
        let { email, password, fullname } = req.body
        let user = await userModel.findOne({ email })
        if (user) return res.status(400).json({
            success: false,
            msg: "Email already exists"
        })

        bcrypt.genSalt(12, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                let user = await userModel.create({
                    fullname,
                    email,
                    password: hash
                })
                return res.status(200).json({
                    success: true,
                    msg: "User created successfully"
                })
            })
        })

    }
    catch (err) {
        res.status(500).json({ success: false, msg: err.message })
    }
}
exports.login = async (req, res) => {
    try {
        let { email, password } = req.body
        let user = await userModel.findOne({ email })
        if (!user) return res.status(400).json({
            success: false,
            msg: "Email doesnt exists"
        })

        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {

                let token = jwt.sign({ userId: user._id }, "secret")
                
                return res.status(200).json({
                    success: true,
                    msg: "User logged in",
                    token:token
                })
            }

            res.status(501).json({
                success: false,
                msg: "User password is incorrect"
            })
        })

    }
    catch (err) {
        res.status(500).json({ success: false, msg: err.message })
    }
}
exports.createProj = async (req, res) => {
    try {
        let { name, projectLanguage,version, token } = req.body
        let decoded = jwt.verify(token, "secret")
        let user = await userModel.findOne({ _id: decoded.userId })
        if (!user) return res.status(400).json({
            success: false,
            msg: "User not found"
        })
        let pr = await projectModel.findOne({ name })
        if (pr) return res.status(400).json({
            success: false,
            msg: "Project already exists"
        })
        const getStarterCode = (language) => {
            switch (language) {
                case "python":
                    return `# Welcome to Python!
          print("Hello, World!")`;
                case "java":
                    return `// Welcome to Java!
          public class Main {
              public static void main(String[] args) {
                  System.out.println("Hello, World!");
              }
          }`;
                case "cpp":
                    return `// Welcome to C++!
          #include <iostream>
          using namespace std;
          
          int main() {
              cout << "Hello, World!" << endl;
              return 0;
          }`;
                case "javascript":
                    return `// Welcome to JavaScript!
          console.log("Hello, World!");`;
                case "c":
                    return `// Welcome to C!
          #include <stdio.h>
          
          int main() {
              printf("Hello, World!\\n");
              return 0;
          }`;
                case "go":
                    return `// Welcome to Go!
          package main
          
          import "fmt"
          
          func main() {
              fmt.Println("Hello, World!")
          }`;
                case "bash":
                    return `# Welcome to Bash!
          echo "Hello, World!"`;
                default:
                    return `// Select a language to get started!`;
            }
        };

        let project = await projectModel.create({
            name,
            projectLanguage,
            version,
            createdBy: user._id,
            code: getStarterCode(projectLanguage)
        })

        return res.status(200).json({
            msg: "Project created successfully",
            success: true,
            project
        })


    }
    catch (err) {
        res.status(500).json({ success: false, msg: err.message })
    }
}
exports.saveProject = async (req, res) => {
    try {
        let { projectId, code, token } = req.body
        let decoded = jwt.verify(token, "secret")
        let user = await userModel.findOne({ _id: decoded.userId })
        if (!user) return res.status(400).json({
            success: false,
            msg: "User not found"
        })
        let pr = await projectModel.findOneAndUpdate({ _id: projectId }, { code })

        return res.status(200).json({
            msg: "Project saved successfully",
            success: true,
            project: pr
        })


    }
    catch (err) {
        res.status(500).json({ success: false, msg: err.message })
    }
}
exports.deleteProject = async (req, res) => {
    try {
        let { projectId, token } = req.body
        let decoded = jwt.verify(token, "secret")
        let user = await userModel.findOne({ _id: decoded.userId })
        if (!user) return res.status(400).json({
            success: false,
            msg: "User not found"
        })
        let pr = await projectModel.findOneAndDelete({ _id: projectId })

        return res.status(200).json({
            msg: "Project deleted successfully",
            success: true
        })


    }
    catch (err) {
        res.status(500).json({ success: false, msg: err.message })
    }
}
exports.updateProject = async (req, res) => {
    try {
        let { projectId, token, name } = req.body
        let decoded = jwt.verify(token, "secret")
        let user = await userModel.findOne({ _id: decoded.userId })
        if (!user) return res.status(400).json({
            success: false,
            msg: "User not found"
        })
        let pr = await projectModel.findOneAndUpdate({ _id: projectId }, { name })

        return res.status(200).json({
            msg: "Project Updated successfully",
            success: true
        })


    }
    catch (err) {
        res.status(500).json({ success: false, msg: err.message })
    }
}
exports.getProjects = async (req, res) => {
    try {
        let { token } = req.body
        let decoded = jwt.verify(token, "secret")
        let user = await userModel.findOne({ _id: decoded.userId })
        if (!user) return res.status(400).json({
            success: false,
            msg: "User not found"
        })
        let pr = await projectModel.find({ createdBy: user._id })
        if (!pr) return res.status(400).json({
            success: false,
            msg: "Project doesnt exists"
        })



        return res.status(200).json({
            msg: "Project saved successfully",
            success: true,
            projects: pr
        })


    }
    catch (err) {
        res.status(500).json({ success: false, msg: err.message })
    }
}
exports.getProject = async (req, res) => {
    try {
        let { projectId, token } = req.body
        let decoded = jwt.verify(token, "secret")
        let user = await userModel.findOne({ _id: decoded.userId })
        if (!user) return res.status(400).json({
            success: false,
            msg: "User not found"
        })
        let pr = await projectModel.findOne({ _id: projectId })
        if (!pr) return res.status(400).json({
            success: false,
            msg: "Project doesnt exists"
        })



        return res.status(200).json({
            msg: "Project saved successfully",
            success: true,
            project: pr
        })


    }
    catch (err) {
        res.status(500).json({ success: false, msg: err.message })
    }
}