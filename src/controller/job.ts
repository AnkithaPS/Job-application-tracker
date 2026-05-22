import { totalmem } from "node:os";
import pool from "../config/db";
import { getCache, setCache } from "../services/redisService";

//Create new job
export const createJob = async (req: any, res: any, next: any) => {
  try {
    const { company, position, salary, location, status, notes } = req.body;
    const jobs = await pool.query(
      "INSERT INTO jobs(user_id,company,position,salary,location,status,notes) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [
        req?.user?.id,
        company,
        position,
        salary,
        location,
        status ?? "Applied",
        notes,
      ],
    );
    res
      .status(201)
      .json({ message: "Job Created successfully!", data: jobs.rows[0] });
  } catch (error) {
    next(error);
  }
};

//Fetch job details
export const getJobs = async (req: any, res: any, next: any) => {
  try {
    let { search } = req.query;
    const page = Number(req.query.page) || 1,
      limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    let jobs, jobCounts, key;
    if (!search) {
      key = `jobs:${req.user.id}:page:${page}:limit:${limit}`;
      const cached = await getCache(key);
      if (cached) {
        return res.status(200).json({ message: "Job details", cached });
      }
      jobs = await pool.query(
        "SELECT * from jobs WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3 ",
        [req?.user?.id, limit, offset],
      );
      jobCounts = await pool.query(
        "SELECT COUNT(*) from jobs WHERE user_id=$1",
        [req?.user?.id],
      );
    } else {
      key = `jobs:${req.user.id}:search:${search}:page:${page}:limit:${limit}`;

      const cached = await getCache(key);

      if (cached) {
        return res
          .status(200)
          .json({ message: "Job details fetched.", cached });
      }
      const searchQuery = `%${search}%`;
      jobs = await pool.query(
        "SELECT * FROM jobs WHERE user_id=$1 AND (company ILIKE $2 OR status ILIKE $2 OR notes ILIKE $2) ORDER BY created_at DESC LIMIT $3 OFFSET $4",
        [req?.user?.id, searchQuery, limit, offset],
      );

      jobCounts = await pool.query(
        "SELECT COUNT(*) FROM jobs WHERE user_id=$1 AND (company ILIKE $2 OR status ILIKE $2 OR notes ILIKE $2) ",
        [req?.user?.id, searchQuery],
      );
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
    await setCache(key, JSON.stringify(data));
    res.status(200).json({ message: "Job details fetched.", ...data });
  } catch (error) {
    next(error);
  }
};

//Update job details
export const updateJobs = async (req: any, res: any, next: any) => {
  try {
    const { status, notes } = req.body;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        message: "Job id required",
      });
    }
    const updateJob = await pool.query(
      "UPDATE jobs SET status=COALESCE($1,status), notes=COALESCE($2,notes) WHERE id=$3 RETURNING * ",
      [status, notes, jobId],
    );
    res
      .status(200)
      .json({ message: "Job updated successfully!", data: updateJob.rows[0] });
  } catch (error) {
    next(error);
  }
};

//delete job details
export const deleteJob = async (req: any, res: any, next: any) => {
  try {
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required!" });
    }

    const job = await pool.query(
      "DELETE FROM jobs WHERE user_id=$1 AND id=$2 ",
      [req?.user?.id, jobId],
    );

    res.status(200).json({ message: "Job deleted successfully!" });
  } catch (error) {
    next(error);
  }
};
