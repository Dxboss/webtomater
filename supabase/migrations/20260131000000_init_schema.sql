-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    budget VARCHAR(50),
    timeline VARCHAR(50),
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'disqualified', 'converted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

-- Consultation booking requests
CREATE TABLE IF NOT EXISTS booking_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    website VARCHAR(500),
    revenue VARCHAR(50),
    challenge TEXT NOT NULL,
    preferred_date DATE,
    ip_address INET,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
    calendar_event_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_booking_requests_email ON booking_requests(email);
CREATE INDEX IF NOT EXISTS idx_booking_requests_created_at ON booking_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);

-- Webhook event logging
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    source_id UUID NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    response_data JSONB
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON webhook_events(status);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Contact Submissions: Public can insert, only admin/authenticated can view
CREATE POLICY "Public can insert contact submissions" 
ON contact_submissions FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact submissions" 
ON contact_submissions FOR SELECT 
TO authenticated 
USING (true);

-- Booking Requests: Public can insert, only admin/authenticated can view
CREATE POLICY "Public can insert booking requests" 
ON booking_requests FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Authenticated users can view booking requests" 
ON booking_requests FOR SELECT 
TO authenticated 
USING (true);

-- Webhook Events: Only authenticated/service role can access
CREATE POLICY "Authenticated users can all webhook events" 
ON webhook_events FOR ALL 
TO authenticated 
USING (true);

-- Grant permissions (Explicit grants as per guidelines)
GRANT ALL PRIVILEGES ON contact_submissions TO authenticated;
GRANT INSERT ON contact_submissions TO anon;

GRANT ALL PRIVILEGES ON booking_requests TO authenticated;
GRANT INSERT ON booking_requests TO anon;

GRANT ALL PRIVILEGES ON webhook_events TO authenticated;
