"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJobs = exports.getJobs = exports.createJob = void 0;
const db_1 = __importDefault(require("../config/db"));
//Create new job
const createJob = async (req, res, next) => {
    try {
        const { company, position, salary, location, status, notes } = req.body;
        const jobs = await db_1.default.query("INSERT INTO jobs(user_id,company,position,salary,location,status,notes) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *", [req?.user?.id, company, position, salary, location, status, notes]);
        res
            .status(201)
            .json({ message: "Job Created successfully!", data: jobs.rows[0] });
    }
    catch (error) {
        next(error);
    }
};
exports.createJob = createJob;
//Fetch all job details of logged in user
const getJobs = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1, limit = Number(req.querylimit) || 10;
        const offset = (page - 1) * limit;
        const jobs = await db_1.default.query("SELECT * from jobs WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3 ", [req?.user?.id, limit, offset]);
        const jobsCount = await db_1.default.query("SELECT COUNT(*) from jobs WHERE user_id=$1", [req?.user?.id]);
        const data = {
            data: jobs.rows,
            pagination: {
                totalData: jobsCount.rows[0].count,
                page,
                limit,
                totalPages: Math.ceil(jobsCount.rows[0].count / limit),
            },
        };
        res.status(200).json({ message: "Job details", ...data });
    }
    catch (error) {
        next(error);
    }
};
exports.getJobs = getJobs;
//Update job details
const updateJobs = async (req, res, next) => {
    try {
        const { status, notes } = req.body;
        const jobId = req.params.id;
        const updateJob = await db_1.default.query("UPDATE jobs SET status=COALESCE($1,status), notes=COALESCE($2,notes) WHERE id=$3 RETURNING * ", [status, notes, jobId]);
        res
            .status(200)
            .json({ message: "Job updated successfully!", data: updateJob.rows[0] });
    }
    catch (error) {
        next(error);
    }
};
exports.updateJobs = updateJobs;
