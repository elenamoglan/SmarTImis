const db = require('../../config/db');

const createIssue = async (issue) => {
  const { user_id, title, description, image_url, latitude, longitude, address } = issue;
  const query = `
    INSERT INTO issue_reports (user_id, title, description, image_url, latitude, longitude, address)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
  `;
  const result = await db.query(query, [
    user_id,
    title,
    description,
    image_url,
    latitude,
    longitude,
    address,
  ]);
  return result.rows[0];
};

const findAllIssues = async (limit, offset, status) => {
  let query = `
    SELECT i.*, u.name as reporter_name
    FROM issue_reports i
           JOIN users u ON i.user_id = u.id
  `;
  const params = [];

  if (status) {
    query += ` WHERE i.status = $1`;
    params.push(status);
  }

  query += ` ORDER BY i.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await db.query(query, params);
  return result.rows;
};

const findIssueById = async (id) => {
  const query = `
    SELECT i.*, u.name as reporter_name
    FROM issue_reports i
           JOIN users u ON i.user_id = u.id
    WHERE i.id = $1
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const updateIssueStatus = async (id, status) => {
  const query = `
    UPDATE issue_reports
    SET status = $1, updated_at = NOW()
    WHERE id = $2
      RETURNING *
  `;
  const result = await db.query(query, [status, id]);
  return result.rows[0];
};

const findIssuesByUserId = async (userId) => {
  const query = `
    SELECT * FROM issue_reports WHERE user_id = $1 ORDER BY created_at DESC
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
};

const countIssuesByStatus = async () => {
  const query = `
    SELECT status, COUNT(*) as count FROM issue_reports GROUP BY status
  `;
  const result = await db.query(query);
  return result.rows;
};

const likeIssue = async (userId, issueId) => {
  // Check if like exists
  const checkQuery = 'SELECT * FROM issue_likes WHERE user_id = $1 AND issue_id = $2';
  const checkResult = await db.query(checkQuery, [userId, issueId]);

  if (checkResult.rows.length > 0) {
    // Already liked, so remove like (toggle)
    await db.query('DELETE FROM issue_likes WHERE user_id = $1 AND issue_id = $2', [userId, issueId]);
    await db.query('UPDATE issue_reports SET likes_count = likes_count - 1 WHERE id = $1', [issueId]);
    return { liked: false };
  } else {
    // Add like
    await db.query('INSERT INTO issue_likes (user_id, issue_id) VALUES ($1, $2)', [userId, issueId]);
    await db.query('UPDATE issue_reports SET likes_count = likes_count + 1 WHERE id = $1', [issueId]);
    return { liked: true };
  }
};

module.exports = {
  createIssue,
  findAllIssues,
  findIssueById,
  updateIssueStatus,
  findIssuesByUserId,
  countIssuesByStatus,
  likeIssue
};
