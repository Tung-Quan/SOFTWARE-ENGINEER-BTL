# Tên file: server.py
from flask import Flask, jsonify
from flask_cors import CORS
import psutil

app = Flask(__name__)
CORS(app)

# Helper: Hàm chuyển đổi bytes sang GB
def bytes_to_gb(bytes_val):
    return round(bytes_val / (1024**3), 1)

@app.route('/api/stats')
def get_stats():
    """Cung cấp thông số cơ bản VÀ chi tiết."""
    
    # === Dữ liệu cho Gauges (như cũ) ===
    cpu_usage = psutil.cpu_percent(interval=None)
    memory_info = psutil.virtual_memory()
    memory_usage = memory_info.percent
    
    try:
        disk_info = psutil.disk_usage('/')
    except FileNotFoundError:
        disk_info = psutil.disk_usage('C:')
    disk_usage = disk_info.percent
    
    swap_info = psutil.swap_memory()
    swap_usage = swap_info.percent
    
    # === Dữ liệu MỚI cho Area Charts ===
    
    # 1. Chi tiết CPU
    # (interval=None lấy % kể từ lần gọi trước hoặc từ lúc boot)
    # Chúng ta cần interval nhỏ để lấy số liệu tức thời
    cpu_times = psutil.cpu_times_percent(interval=0.1) 
    
    # 2. Chi tiết Memory (đổi sang GB)
    # memory_info đã lấy ở trên
    mem_total_gb = bytes_to_gb(memory_info.total)
    mem_used_gb = bytes_to_gb(memory_info.used)
    
    # Trả về JSON, thêm 2 key mới
    return jsonify({
        # Dữ liệu cũ cho gauges
        'cpuUsage': cpu_usage,
        'memoryUsage': memory_usage,
        'diskUsage': disk_usage,
        'swapUsage': swap_usage,
        
        # Dữ liệu mới cho charts
        'cpuDetail': {
            'user': cpu_times.user,
            'system': cpu_times.system, # Dùng 'system' thay cho 'IQRs'
        },
        'memDetail': {
            'totalGB': mem_total_gb,
            'usedGB': mem_used_gb,
        }
    })

if __name__ == '__main__':
    print("Starting system stats server (v2) at http://localhost:5000/api/stats")
    app.run(port=5000)