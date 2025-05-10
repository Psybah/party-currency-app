import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { fetchStates, fetchLGAs } from '@/api/locationApi';

export function LocationSelect({ formData, handleInputChange }) {
	const { data: states, isLoading: statesLoading } = useQuery({
		queryKey: ['states'],
		queryFn: () => fetchStates(),
		onError: (error) => {
			toast.error(error.message);
		},
	});
	console.log(states, 'states');

	const { data: lgas, isLoading: lgasLoading } = useQuery({
		queryKey: ['lgas', formData.state],
		queryFn: () => fetchLGAs(formData.state),
		enabled: !!formData.state,
		onError: (error) => {
			toast.error(error.message);
		},
	});

	console.log(lgas, 'here');

	const handleStateChange = (value) => {
		handleInputChange({
			target: {
				name: 'state',
				value,
			},
		});
		handleInputChange({
			target: {
				name: 'lga',
				value: '',
			},
		});
	};

	const handleLGAChange = (value) => {
		handleInputChange({
			target: {
				name: 'lga',
				value,
			},
		});
	};

	return (
		<>
			<div className='space-y-2'>
				<label className='text-sm font-medium text-left block'>State</label>
				<Select
					value={formData.state}
					onValueChange={handleStateChange}
					disabled={statesLoading}>
					<SelectTrigger className='w-full'>
						<SelectValue
							placeholder={statesLoading ? 'Loading states...' : 'Select state'}
						/>
					</SelectTrigger>
					<SelectContent>
						{states?.map((state) => (
							<SelectItem key={state} value={state}>
								{state}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className='space-y-2'>
				<label className='text-sm font-medium text-left block'>City</label>
				<Input
					name='city'
					value={formData.city || ''}
					onChange={handleInputChange}
					placeholder='Enter city name'
					className='w-full'
				/>
			</div>

			<div className='space-y-2'>
				<label className='text-sm font-medium text-left block'>LGA</label>
				<Select
					value={formData.lga}
					onValueChange={handleLGAChange}
					disabled={!formData.state || lgasLoading}>
					<SelectTrigger className='w-full'>
						<SelectValue
							placeholder={
								!formData.state
									? 'Select a state first'
									: lgasLoading
									? 'Loading LGAs...'
									: 'Select LGA'
							}
						/>
					</SelectTrigger>
					<SelectContent>
						{lgas?.map((lga) => (
							<SelectItem key={lga} value={lga}>
								{lga}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</>
	);
}

LocationSelect.propTypes = {
	formData: PropTypes.shape({
		state: PropTypes.string,
		city: PropTypes.string,
		lga: PropTypes.string,
	}).isRequired,
	handleInputChange: PropTypes.func.isRequired,
};