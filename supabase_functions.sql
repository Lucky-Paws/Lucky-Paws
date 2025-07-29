-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts 
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment like count
CREATE OR REPLACE FUNCTION increment_like_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts 
  SET like_count = like_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement like count
CREATE OR REPLACE FUNCTION decrement_like_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts 
  SET like_count = GREATEST(0, like_count - 1)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment comment count
CREATE OR REPLACE FUNCTION increment_comment_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts 
  SET comment_count = comment_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement comment count
CREATE OR REPLACE FUNCTION decrement_comment_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts 
  SET comment_count = GREATEST(0, comment_count - 1)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment comment like count
CREATE OR REPLACE FUNCTION increment_comment_like_count(comment_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE comments 
  SET like_count = like_count + 1
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql;