import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from 'src/app/services/producto.service';
import { Producto } from 'src/app/models/producto';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css'],
})
export class CrearProductoComponent implements OnInit {
  productoForm!: FormGroup;
  id: string | undefined = undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private productoService: ProductoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      producto: [null, Validators.required],
      cantidad: [null, [Validators.required, Validators.min(0)]],
      precio: [null, [Validators.required, Validators.min(0)]],
    });

    // Obtener el 'id' de la URL
    this.id = this.route.snapshot.paramMap.get('id') || undefined;

    if (this.id) {
      this.cargarProducto();
    }
  }

  cargarProducto() {
    if (this.id) {
      this.productoService.getProductoById(this.id).subscribe({
        next: (producto: Producto) => {
          // Rellenar el formulario con los datos del producto
          this.productoForm.patchValue({
            producto: producto.producto,
            cantidad: producto.cantidad,
            precio: producto.precio,
          });
        },
        error: (err) => {
          console.error('Error al cargar el producto:', err);
          this.toastr.error('No se pudo cargar el producto para editar');
        },
      });
    } else {
      console.error('ID no encontrado');
      this.toastr.error('Producto no encontrado');
    }
  }
  

  agregarProducto() {
    const productoData = this.productoForm.value;
    if (this.id) {
      // Editar producto
      this.productoService.actualizarProducto(this.id, productoData).subscribe({
        next: () => {
          console.log('Producto editado correctamente');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error al editar producto:', err);
        },
      });
    } else {
      // Crear nuevo producto
      this.productoService.crearProducto(productoData).subscribe({
        next: () => {
          console.log('Producto creado correctamente');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error al crear producto:', err);
        },
      });
    }
  }

  resetFormulario() {
    this.productoForm.reset();
    this.id = undefined;
  }
}
