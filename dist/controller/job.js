"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.updateJobs = exports.getJobs = exports.createJob = void 0;
const db_1 = __importDefault(require("../config/db"));
const redisService_1 = require("../services/redisService");
//Create new job
const createJob = async (req, res, next) => {
    try {
        const { company, position, salary, location, status, notes } = req.body;
        const jobs = await db_1.default.query("INSERT INTO jobs(user_id,company,position,salary,location,status,notes) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *", [
            req?.user?.id,
            company,
            position,
            salary,
            location,
            status ?? "Applied",
            notes,
        ]);
        res
            .status(201)
            .json({ message: "Job Created successfully!", data: jobs.rows[0] });
    }
    catch (error) {
        next(error);
    }
};
exports.createJob = createJob;
//Fetch job details
const getJobs = async (req, res, next) => {
    try {
        let { search } = req.query;
        const page = Number(req.query.page) || 1, limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        let jobs, jobCounts, key;
        if (!search) {
            key = `jobs:${req.user.id}:page:${page}:limit:${limit}`;
            const cached = await (0, redisService_1.getCache)(key);
            if (cached) {
                return res.status(200).json({ message: "Job details", cached });
            }
            jobs = await db_1.default.query("SELECT * from jobs WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3 ", [req?.user?.id, limit, offset]);
            jobCounts = await db_1.default.query("SELECT COUNT(*) from jobs WHERE user_id=$1", [req?.user?.id]);
        }
        else {
            key = `jobs:${req.user.id}:search:${search}:page:${page}:limit:${limit}`;
            const cached = await (0, redisService_1.getCache)(key);
            if (cached) {
                return res
                    .status(200)
                    .json({ message: "Job details fetched.", cached });
            }
            const searchQuery = `%${search}%`;
            jobs = await db_1.default.query("SELECT * FROM jobs WHERE user_id=$1 AND (company ILIKE $2 OR status ILIKE $2 OR notes ILIKE $2) ORDER BY created_at DESC LIMIT $3 OFFSET $4", [req?.user?.id, searchQuery, limit, offset]);
            jobCounts = await db_1.default.query("SELECT COUNT(*) FROM jobs WHERE user_id=$1 AND (company ILIKE $2 OR status ILIKE $2 OR notes ILIKE $2) ", [req?.user?.id, searchQuery]);
        }
        const totalData = Number(jobCounts.rows[0].count);
        const data = {
            data: jobs.rows,
            pagination: {
                totalData,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalData / limit),
            },
        };
        await (0, redisService_1.setCache)(key, JSON.stringify(data));
        res.status(200).json({ message: "Job details fetched.", ...data });
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
        if (!jobId) {
            return res.status(400).json({
                message: "Job id required",
            });
        }
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
//delete job details
const deleteJob = async (req, res, next) => {
    try {
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required!" });
        }
        const job = await db_1.default.query("DELETE FROM jobs WHERE user_id=$1 AND id=$2 ", [req?.user?.id, jobId]);
        res.status(200).json({ message: "Job deleted successfully!" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteJob = deleteJob;
