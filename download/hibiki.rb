require 'uri'
require 'open-uri'
require 'json'
require 'aws-sdk-s3'

def api(url)
  json = open(url, 'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.82 Safari/537.36', 'Origin' => 'http://hibiki-radio.jp', 'Referer' => 'http://hibiki-radio.jp/', 'X-Requested-With' => 'XMLHttpRequest', &:read)
  JSON.parse(json)
end

def put_s3(file)
  s3 = Aws::S3::Resource.new
  obj = s3.bucket(ENV['BUCKET_NAME']).object(file)
  File.open(file, 'rb') do |body|
    obj.put(body: body)
  end
end

program = api("https://vcms-api.hibiki-radio.jp/api/v1/programs/llss")
episode = program['episode']
puts "episode:#{episode}"

serial = episode['name'].scan(/([\d\.]+)/).flatten.first
puts "serial:#{serial}"

m3u8 = api("https://vcms-api.hibiki-radio.jp/api/v1/videos/play_check?video_id=#{episode['video']['id']}")['playlist_url']
puts "playlist_url:#{m3u8}"

file_name = "llss#{serial}.mp4"

cmd = [
  'ffmpeg',
  '-y',
  '-i', m3u8,
  *%w(-vcodec copy -acodec copy -bsf:a aac_adtstoasc -loglevel debug) ,
  file_name,
].map(&:to_s)

status = system(*cmd)
if status
  put_s3(file_name)
  puts "  * Done!"
else
  puts "  * Failed ;("
  nil
end
