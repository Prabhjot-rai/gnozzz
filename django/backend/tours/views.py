from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import User, Tour, Booking
from decimal import Decimal

def authenticate_user(request):
    username = request.POST.get('username') 
    password = request.POST.get('password') 
    if not username or not password:
        return None
    try:
        return User.objects.get(username=username, password=password)
    except User.DoesNotExist:
        return None

@csrf_exempt
@require_http_methods(["POST"])
def signup(request):
    username = request.POST.get('username')
    password = request.POST.get('password')
    role = request.POST.get('role')
    position = request.POST.get('position')
    if not all([username, password, role, position]):
        return JsonResponse({'error': 'Missing fields'}, status=400)
    if User.objects.filter(username=username).exists():
        return JsonResponse({'error': 'Username exists'}, status=400)
    User.objects.create(username=username, password=password, role=role, position=position)
    return JsonResponse({'message': 'User created'}, status=201)

@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    user = authenticate_user(request)
    if user:
        return JsonResponse({
            'role': user.role,
            'username': user.username,
            'password': user.password 
        })
    return JsonResponse({'error': 'Invalid credentials'}, status=401)

@csrf_exempt
@require_http_methods(["POST"])
def get_tours(request):
    user = authenticate_user(request)
    if not user:
         return JsonResponse({'error': 'Unauthorized'}, status=401)
    tours = Tour.objects.all()
    tours_data = [{
        'id': t.id,
        'title': t.title,
        'price': str(t.price),
        'left_seats': t.left_seats,
        'seats': t.seats,
        'agent': 'admin' if not t.agent else t.agent.id
    } for t in tours]
    return JsonResponse(tours_data, safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def create_tour(request):
    user = authenticate_user(request)
    if not user or user.role not in ['admin', 'agent']:
        return JsonResponse({'error': 'Permission denied'}, status=403)
    agent = None if user.role == 'admin' else user
    Tour.objects.create(
        title=request.POST.get('title'),
        description=request.POST.get('description'),
        price=Decimal(request.POST.get('price')),
        start_date=request.POST.get('start_date'),
        end_date=request.POST.get('end_date'),
        seats=int(request.POST.get('seats')),
        left_seats=int(request.POST.get('seats')),
        agent=agent
    )
    return JsonResponse({'message': 'Tour created'}, status=201)

@csrf_exempt
@require_http_methods(["POST"])
def update_tour(request):
    user = authenticate_user(request)
    tour_id = request.POST.get('id')
    if not user or not tour_id:
        return JsonResponse({'error': 'Unauthorized or Missing ID'}, status=401)
    try:
        tour = Tour.objects.get(id=tour_id)
    except Tour.DoesNotExist:
        return JsonResponse({'error': 'Tour not found'}, status=404)
    
    if user.role not in ['admin', 'manager'] and (user.role != 'agent' or tour.agent != user):
        return JsonResponse({'error': 'Permission denied'}, status=403)

    # Update fields
    tour.title = request.POST.get('title', tour.title)
    tour.description = request.POST.get('description', tour.description)
    tour.price = Decimal(request.POST.get('price', tour.price))
    tour.start_date = request.POST.get('start_date', tour.start_date)
    tour.end_date = request.POST.get('end_date', tour.end_date)
    tour.seats = int(request.POST.get('seats'))
    tour.left_seats = int(request.POST.get('left_seats', tour.left_seats))

    tour.save()  # Save the updated tour

    return JsonResponse({'message': 'Tour updated'})

@csrf_exempt
@require_http_methods(["POST"])
def delete_tour(request):
    user = authenticate_user(request)
    tour_id = request.POST.get('id')
    if not user or user.role != 'admin':
        return JsonResponse({'error': 'Permission denied'}, status=403)
    
    if not tour_id:  # Ensure the tour ID is provided
        return JsonResponse({'error': 'Missing ID'}, status=400)

    try:
        tour = Tour.objects.get(id=tour_id)
        tour.delete()
        return JsonResponse({'message': 'Tour deleted'})
    except Tour.DoesNotExist:
        return JsonResponse({'error': 'Tour not found'}, status=404)

@csrf_exempt
@require_http_methods(["POST"])
def get_users(request):
    user = authenticate_user(request)
    if not user or user.role not in ['admin', 'manager']:
        return JsonResponse({'error': 'Permission denied'}, status=403)
    users = User.objects.all()
    return JsonResponse(list(users.values('id', 'username', 'role', 'position')), safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def delete_user(request):
    user = authenticate_user(request)
    user_id = request.POST.get('id')
    if not user or user.role != 'admin':
        return JsonResponse({'error': 'Permission denied'}, status=403)
    try:
        User.objects.get(id=user_id).delete()
        return JsonResponse({'message': 'User deleted'})
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)