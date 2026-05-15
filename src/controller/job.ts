import pool from "../config/db";

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

//Fetch all job details of logged in user
export const getJobs = async (req: any, res: any, next: any) => {
  try {
    const page = Number(req.query.page) || 1,
      limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const jobs = await pool.query(
      "SELECT * from jobs WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3 ",
      [req?.user?.id, limit, offset],
    );
    const jobsCount = await pool.query(
      "SELECT COUNT(*) from jobs WHERE user_id=$1",
      [req?.user?.id],
    );
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
  } catch (error) {
    next(error);
  }
};

//Update job details
export const updateJobs = async (req: any, res: any, next: any) => {
  try {
    const { status, notes } = req.body;
    const jobId = req.params.id;
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
