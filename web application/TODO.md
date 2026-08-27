# TODO - Fix register + scan saving

## Step 1: Fix scan saving (farmId + auth)
- [ ] Enforce `farmId` before scan submission OR require farmId on backend for saving
- [ ] Confirm scan endpoint includes auth token (req.user)

## Step 2: Fix register flow mismatch
- [ ] Align frontend register next-step with backend verification method (email verify vs phone OTP)

## Step 3: Verify multipart field names
- [ ] Ensure frontend sends `image` key (multer uses `upload.single('image')`)

## Step 4: Add diagnostics
- [ ] Add server-side logging when scan arrives without `req.user` or without valid `farmId`

## Step 5: Manual verification
- [ ] Register -> verify -> login -> create farm -> scan -> report appears in dashboard

