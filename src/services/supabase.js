import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://nmzahnenphtqtxsbxjsh.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5temFobmVucGh0cXR4c2J4anNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQwODM3MTEsImV4cCI6MjAwOTY1OTcxMX0.nAIkX8Pf-OJL7mY3ofNoXY__r6jNjM_66CPznSkiRV8";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
