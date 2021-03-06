import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from '../../base/base-component';
import { finalize } from 'rxjs/operators';
import { checkTakenTeamName } from 'src/app/pages/teams/pipes/team-name-taken'
import { ErrorMessages, Notes } from 'uilib';
import { TeamService } from 'common';

@Component({
  selector: 'add-team',
  templateUrl: './add-team.html',
})
export class AddTeamComponent extends BaseComponent {
  form: FormGroup;

  get name() {
		return this.form.get('name');
	}

	get email() {
		return this.form.get('email');
  }
  
  constructor( 
		public teamService: TeamService,
		public router: Router ) {
      super();
      
      this.form = new FormGroup({
        'name': new FormControl(null, Validators.required, checkTakenTeamName.bind( this, teamService, false )),
        'email': new FormControl(null, Validators.email)
      });
  }
  
  
  
	onSubmit(){
		this.waiting = true

    const payload = {
      ...this.form.value,
      //version: this.folder.version
    }
		
		this
			.teamService
			.createTeam( payload )
			.pipe( 
				finalize( () => this.waiting = false ))
			.subscribe( 
				x => {
					Notes.success( x.message );
					this.router.navigate( [`/org/teams/edit/${x.teamId}`] );
				},
				e => Notes.error(	e.error?.message ?? ErrorMessages.BAD_CREATE_TEAM ));
  }
}

